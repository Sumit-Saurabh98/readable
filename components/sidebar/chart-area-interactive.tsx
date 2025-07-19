"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "An interactive bar chart"

// const dummyEnrollmentData = [
//   {
//     date: '2024-05-15', enrollments: 12
//   },
//   {
//     date: '2024-05-16', enrollments: 34
//   },
//   {
//     date: '2024-05-17', enrollments: 23
//   },
//   {
//     date: '2024-05-18', enrollments: 15
//   },
//   {
//     date: '2024-05-19', enrollments: 1
//   },
//   {
//     date: '2024-05-20', enrollments: 98
//   },
//   {
//     date: '2024-05-21', enrollments: 24
//   },
//   {
//     date: '2024-05-22', enrollments: 33
//   },
//   {
//     date: '2024-05-23', enrollments: 4
//   },
//   {
//     date: '2024-05-24', enrollments: 32
//   },
//   {
//     date: '2024-05-25', enrollments: 45
//   },
//   {
//     date: '2024-05-26', enrollments: 22
//   },
//   {
//     date: '2024-05-27', enrollments: 12
//   },
//   {
//     date: '2024-05-28', enrollments: 34
//   },
//   {
//     date: '2024-05-29', enrollments: 23
//   },
//   {
//     date: '2024-05-30', enrollments: 15
//   },
//   {
//     date: '2024-06-15', enrollments: 4
//   },
//   {
//     date: '2024-06-16', enrollments: 98
//   },
//   {
//     date: '2024-06-17', enrollments: 24
//   },
//   {
//     date: '2024-06-18', enrollments: 33
//   },
//   {
//     date: '2024-06-19', enrollments: 4
//   },
//   {
//     date: '2024-06-20', enrollments: 32
//   },
//   {
//     date: '2024-06-21', enrollments: 45
//   },
//   {
//     date: '2024-06-22', enrollments: 22
//   },
//   {
//     date: '2024-06-23', enrollments: 4
//   },
//   {
//     date: '2024-06-24', enrollments: 98
//   },
//   {
//     date: '2024-06-25', enrollments: 24
//   },
//   {
//     date: '2024-06-26', enrollments: 33
//   },
//   {
//     date: '2024-06-27', enrollments: 4
//   },
//   {
//     date: '2024-06-28', enrollments: 32
//   },
//   {
//     date: '2024-06-29', enrollments: 45
//   },
//   {
//     date: '2024-06-30', enrollments: 22
//   },
// ]

const chartConfig = {
  enrollments: {
    label: "Enrollments",
    color: "var(--chart-1)",
  }
} satisfies ChartConfig


interface ChartAreaInteractiveProps {
  data: {date: string, enrollments: number}[]
}

export function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {

  const totalEnrollmentsNumber = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.enrollments, 0)
  }, [data])

  return (
    <Card className="@container/card">
     <CardHeader>
      <CardTitle>Total Enrollments</CardTitle>
      <CardDescription>
        <span className="hidden @[540px]/card:block">Total Enrollments for the last 30 days: {totalEnrollmentsNumber}</span>
        <span className="block @[540px]/card:hidden">1200</span>
      </CardDescription>
     </CardHeader>

     <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
      <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
        <BarChart 
        data={data}
        margin={{
          right: 12,
          left: 12
        }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} interval={'preserveStartEnd'} tickFormatter={(value)=>{
            const date = new Date(value);
            return date.toLocaleDateString('en-US', {
              month: "short",
              day: 'numeric'
            })
          }} />

          <ChartTooltip content={
            <ChartTooltipContent className="w-[150px]"  labelFormatter={(value)=>{
              const date = new Date(value);
              return date.toLocaleDateString('en-US', {
                month: "short",
                day: 'numeric'
              })
            }}/>
          }/>

          <Bar dataKey="enrollments" fill="var(--chart-1)" />
        </BarChart>
      </ChartContainer>
     </CardContent>
    </Card>
  )
}
