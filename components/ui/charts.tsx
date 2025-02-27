'use client'

import React from 'react'
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart as RechartsLineChart, Line, PieChart as RechartsPieChart, Pie, Cell, ScatterChart, Scatter, ZAxis } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export const BarChart = ({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <RechartsBarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="completed" fill="#8884d8" />
    </RechartsBarChart>
  </ResponsiveContainer>
)

export const LineChart = ({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <RechartsLineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="productivity" stroke="#8884d8" />
    </RechartsLineChart>
  </ResponsiveContainer>
)

export const PieChart = ({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <RechartsPieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </RechartsPieChart>
  </ResponsiveContainer>
)

export const HeatMap = ({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <ScatterChart
      margin={{
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      }}
    >
      <CartesianGrid />
      <XAxis dataKey="hour" name="hour" />
      <YAxis dataKey="day" name="day" />
      <ZAxis dataKey="value" range={[0, 500]} name="score" />
      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
      <Scatter name="Productivity Score" data={data} fill="#8884d8" />
    </ScatterChart>
  </ResponsiveContainer>
)

export const BubbleChart = ({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <ScatterChart
      margin={{
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      }}
    >
      <CartesianGrid />
      <XAxis dataKey="frequency" name="frequency" />
      <YAxis dataKey="completionRate" name="completion rate" />
      <ZAxis dataKey="frequency" range={[400, 4000]} name="frequency" />
      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
      <Scatter name="Recurring Tasks" data={data} fill="#8884d8">
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Scatter>
    </ScatterChart>
  </ResponsiveContainer>
)
