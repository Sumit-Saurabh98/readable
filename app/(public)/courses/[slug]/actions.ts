"use server"

import { requireUser } from "@/app/data/user/require-user";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { ApiResponse } from "@/lib/types"
import { request } from "@arcjet/next";
import { redirect } from "next/navigation";
import Stripe from "stripe";

const aj = arcjet.withRule(
    fixedWindow({
        mode: 'LIVE',
        window: '1m',
        max: 5
    })
)

export async function enrollInCourseAction(courseId: string): Promise<ApiResponse | never>{

    const user = await requireUser();
    let checkoutUrl: string;

    try {

        const req = await request();

        const decision = await aj.protect(req, {
            fingerprint: user.id
        })

        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                return {
                    status: "error",
                    message: "You have reached the rate limit. Please try again later"
                }
            }else{
                return {
                    status: "error",
                    message: "Dude, you seem to be a bot. You have been blocked"
                }
            }
        }

        const course = await prisma.course.findUnique({
            where: {
                id: courseId
            },
            select:{
                id: true,
                title: true,
                price: true,
                slug: true,
                stripePriceId: true  // Add this to get the dynamic price ID
            }
        })

        if(!course){
            return {
                status: "error",
                message: "Course not found"
            }
        }

        // Check if stripePriceId exists
        if(!course.stripePriceId){
            return {
                status: "error",
                message: "Course pricing not configured"
            }
        }

        let stripeCustomerId: string;

        const userWithStripeCustomerid = await prisma.user.findUnique({
            where: {
                id: user.id
            },
            select: {
                stripeCustomerId: true
            }
        })

        

        if(userWithStripeCustomerid?.stripeCustomerId){
            stripeCustomerId = userWithStripeCustomerid.stripeCustomerId!
        }else{
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: {
                    userId: user.id
                }
            })
            

            stripeCustomerId = customer.id

            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    stripeCustomerId: stripeCustomerId
                }
            })
        }

        const result = await prisma.$transaction(async (tx) => {

            const existingEnrollment = await tx.enrollment.findUnique({
                where: {
                    userId_courseId: {
                        userId: user.id,
                        courseId: courseId
                    }
                },
                select: {
                    status: true,
                    id: true
                }
            });

            if(existingEnrollment?.status === "Active"){
                return {
                    status: "error",
                    message: "You are already enrolled in this course"
                }
            }

            let enrollment;

            if(existingEnrollment){
                enrollment = await tx.enrollment.update({
                    where: {
                        id: existingEnrollment.id
                    },
                    data: {
                        amount: course.price,
                        status: "Pending",
                        updatedAt: new Date()
                    }
                })
            }else{
                enrollment = await tx.enrollment.create({
                    data: {
                        userId: user.id,
                        courseId: course.id,
                        amount: course.price,
                        status: "Pending"
                    }
                })
            }


            const checkoutSesson = await stripe.checkout.sessions.create({
                customer: stripeCustomerId,
                line_items: [
                    {
                        price: course.stripePriceId,  // Use dynamic price ID instead of hardcoded
                        quantity: 1
                    }
                ],
                mode: 'payment',
                success_url: `${env.BETTER_AUTH_URL}/payment/success`,
                cancel_url: `${env.BETTER_AUTH_URL}/payment/cancel`,
                metadata: {
                    userId: user.id,
                    courseId: course.id,
                    enrollmentId: enrollment.id
                }
            })

            return {enrollment: enrollment, checkoutUrl: checkoutSesson.url}
        })

        checkoutUrl = result.checkoutUrl!

        
    } catch (error){

        if(error instanceof Stripe.errors.StripeError){
            return {
                status: "error",
                message: "Payment system error. Please try again"
            }
        }


        return {
            status: "error",
            message: "Failed to enroll in course"
        }
    }

    redirect(checkoutUrl)
}