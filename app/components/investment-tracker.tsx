"use client"

import { useState, useMemo, useEffect } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Moon, Sun, GlobeIcon } from 'lucide-react'
import { useTheme } from "next-themes"

interface InvestmentData {
  date: string
  [key: string]: number | string
}

interface Investment {
  name: string
  color: string
}

interface InvestmentTotals {
  totalShares: number
  totalValue: number
  totalInvested: number
  profitLoss: number
}

type TimeFrame = "day" | "week" | "month" | "year"

type Language = "es" | "en"

const translations = {
  en: {
    title: "Investment Tracker",
    description: "Track and visualize your investments progress",
    timeFrame: "Select time frame",
    day: "Day",
    week: "Week",
    month: "Month",
    year: "Year",
    investmentTotals: "Investment Totals",
    investment: "Investment",
    totalShares: "Total Shares",
    totalValue: "Current Value",
    totalInvested: "Total Invested",
    profitLoss: "Profit/Loss",
    grandTotal: "Grand Total",
    addInvestmentData: "Add Investment Data",
    selectInvestment: "Select investment",
    investmentValue: "Investment Value",
    numberOfShares: "Number of Shares",
    pricePerShare: "Price per Share",
    add: "Add",
    addNewInvestment: "Add New Investment",
    investmentName: "Investment Name",
    investmentData: "Investment Data",
    date: "Date",
    action: "Action",
    edit: "Edit",
    remove: "Remove",
    editInvestmentData: "Edit Investment Data",
    saveChanges: "Save Changes",
    shares: "Shares",
    valuePerShare: "Value per Share",
    totalInvestments: "Total Investments",
    profitLossChart: "Profit/Loss",
    deleteInvestment: "Delete Investment",
    confirmDelete: "Are you sure you want to delete this investment?",
    confirmDeleteData: "Are you sure you want to delete this investment data?",
    yes: "Yes",
    no: "No",
    allInvestments: "All Investments",
    showChart: "Show Chart",
    investedAmount: "Invested Amount",
    currentValue: "Current Value",
  },
  es: {
    title: "Seguimiento de Inversiones",
    description: "Rastrea y visualiza el progreso de tus inversiones",
    timeFrame: "Seleccionar período de tiempo",
    day: "Día",
    week: "Semana",
    month: "Mes",
    year: "Año",
    investmentTotals: "Totales de Inversión",
    investment: "Inversión",
    totalShares: "Acciones Totales",
    totalValue: "Valor Actual",
    totalInvested: "Total Invertido",
    profitLoss: "Ganancia/Pérdida",
    grandTotal: "Gran Total",
    addInvestmentData: "Agregar Datos de Inversión",
    selectInvestment: "Seleccionar inversión",
    investmentValue: "Valor de Inversión",
    numberOfShares: "Número de Acciones",
    pricePerShare: "Precio por Acción",
    add: "Agregar",
    addNewInvestment: "Agregar Nueva Inversión",
    investmentName: "Nombre de Inversión",
    investmentData: "Datos de Inversión",
    date: "Fecha",
    action: "Acción",
    edit: "Editar",
    remove: "Eliminar",
    editInvestmentData: "Editar Datos de Inversión",
    saveChanges: "Guardar Cambios",
    shares: "Acciones",
    valuePerShare: "Valor por Acción",
    totalInvestments: "Inversiones Totales",
    profitLossChart: "Ganancia/Pérdida",
    deleteInvestment: "Eliminar Inversión",
    confirmDelete: "¿Estás seguro de que quieres eliminar esta inversión?",
    confirmDeleteData: "¿Estás seguro de que quieres eliminar estos datos de inversión?",
    yes: "Sí",
    no: "No",
    allInvestments: "Todas las Inversiones",
    showChart: "Mostrar Gráfica",
    investedAmount: "Cantidad Invertida",
    currentValue: "Valor Actual",
  },
}

export default function InvestmentTracker() {
  const [investments, setInvestments] = useState<Investment[]>([
    { name: "SP500", color: "#ffe599" },
    { name: "SP500 Tech Info", color: "#a4c2f4" },
    { name: "AI & Big Data", color: "#f9cb9c" },
  ])

  const [investmentData, setInvestmentData] = useState<InvestmentData[]>([])

  const [newDate, setNewDate] = useState("")
  const [newInvestment, setNewInvestment] = useState("")
  const [newValue, setNewValue] = useState("")
  const [newShares, setNewShares] = useState("")
  const [newPricePerShare, setNewPricePerShare] = useState("")
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("month")

  const [newInvestmentName, setNewInvestmentName] = useState("")
  const [newInvestmentColor, setNewInvestmentColor] = useState("")

  const [editingData, setEditingData] = useState<InvestmentData | null>(null)
  const [deletingInvestment, setDeletingInvestment] = useState<string | null>(null)
  const [deletingData, setDeletingData] = useState<string | null>(null)

  const { setTheme } = useTheme()

  const [language, setLanguage] = useState<Language>("es")
  const t = translations[language]

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleteDataModalOpen, setIsDeleteDataModalOpen] = useState(false)

  const [selectedChart, setSelectedChart] = useState<string | null>(null)

  useEffect(() => {
    const savedInvestments = localStorage.getItem('investments')
    const savedInvestmentData = localStorage.getItem('investmentData')
    if (savedInvestments) {
      setInvestments(JSON.parse(savedInvestments))
    }
    if (savedInvestmentData) {
      setInvestmentData(JSON.parse(savedInvestmentData))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('investments', JSON.stringify(investments))
  }, [investments])

  useEffect(() => {
    localStorage.setItem('investmentData', JSON.stringify(investmentData))
  }, [investmentData])

  const addInvestmentData = (e: React.FormEvent) => {
    e.preventDefault()
    if (newDate && newInvestment && newValue && newShares && newPricePerShare) {
      const updatedData = [...investmentData]
      const existingDateIndex = updatedData.findIndex(item => item.date === newDate)

      if (existingDateIndex !== -1) {
        updatedData[existingDateIndex] = {
          ...updatedData[existingDateIndex],
          [newInvestment]: parseFloat(newValue),
          [`${newInvestment}_shares`]: parseFloat(newShares),
          [`${newInvestment}_invested`]: parseFloat(newValue),
          [`${newInvestment}_price_per_share`]: parseFloat(newPricePerShare),
        }
      } else {
        updatedData.push({
          date: newDate,
          [newInvestment]: parseFloat(newValue),
          [`${newInvestment}_shares`]: parseFloat(newShares),
          [`${newInvestment}_invested`]: parseFloat(newValue),
          [`${newInvestment}_price_per_share`]: parseFloat(newPricePerShare),
        })
      }

      setInvestmentData(updatedData)
      setNewDate("")
      setNewValue("")
      setNewShares("")
      setNewPricePerShare("")
    }
  }

  const addNewInvestment = () => {
    if (newInvestmentName && newInvestmentColor) {
      setInvestments([...investments, { name: newInvestmentName, color: newInvestmentColor }])
      setNewInvestmentName("")
      setNewInvestmentColor("")
    }
  }

  const removeInvestmentData = (date: string) => {
    setInvestmentData(investmentData.filter(item => item.date !== date))
  }

  const editInvestmentData = (data: InvestmentData) => {
    setEditingData(data)
  }

  const saveEditedData = () => {
    if (editingData) {
      const updatedData = investmentData.map(item => 
        item.date === editingData.date ? editingData : item
      )
      setInvestmentData(updatedData)
      setEditingData(null)
      setIsEditModalOpen(false)
    }
  }

  const deleteInvestment = (investmentName: string) => {
    setInvestments(investments.filter(inv => inv.name !== investmentName))
    setInvestmentData(investmentData.map(data => {
      const { ...rest } = data
      return rest as InvestmentData
    }))
    setDeletingInvestment(null)
    setIsDeleteModalOpen(false)
  }

  const aggregateData = useMemo(() => {
    const sortedData = [...investmentData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    
    if (timeFrame === "day") return sortedData

    const aggregated: { [key: string]: InvestmentData } = {}

    sortedData.forEach((item) => {
      const date = new Date(item.date)
      let key: string

      switch (timeFrame) {
        case "week":
          const weekStart = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay())
          key = weekStart.toISOString().split('T')[0]
          break
        case "month":
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
          break
        case "year":
          key = `${date.getFullYear()}`
          break
        default:
          key = item.date
      }

      if (!aggregated[key]) {
        aggregated[key] = { date: key }
      }

      investments.forEach(inv => {
        if (item[`${inv.name}_price_per_share`] !== undefined) {
          aggregated[key][inv.name] = item[`${inv.name}_price_per_share`] as number
        }
      })
    })

    return Object.values(aggregated)
  }, [investmentData, timeFrame, investments])

  const calculateTotals = useMemo(() => {
    const totals: { [key: string]: InvestmentTotals } = {}
    let grandTotalShares = 0
    let grandTotalValue = 0
    let grandTotalInvested = 0
    let grandTotalProfitLoss = 0

    investments.forEach(inv => {
      totals[inv.name] = { totalShares: 0, totalValue: 0, totalInvested: 0, profitLoss: 0 }
    })

    const sortedData = [...investmentData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    investments.forEach(inv => {
      let latestPrice = 0
      sortedData.forEach(data => {
        const shares = data[`${inv.name}_shares`] as number
        const invested = data[`${inv.name}_invested`] as number
        const pricePerShare = data[`${inv.name}_price_per_share`] as number
        
        if (shares && invested && pricePerShare) {
          totals[inv.name].totalShares += shares
          totals[inv.name].totalInvested += invested
          
          if (latestPrice === 0) {
            latestPrice = pricePerShare
          }
        }
      })
      
      totals[inv.name].totalValue = totals[inv.name].totalShares * latestPrice
      totals[inv.name].profitLoss = totals[inv.name].totalValue - totals[inv.name].totalInvested

      grandTotalShares += totals[inv.name].totalShares
      grandTotalValue += totals[inv.name].totalValue
      grandTotalInvested += totals[inv.name].totalInvested
      grandTotalProfitLoss += totals[inv.name].profitLoss
    })

    return { 
      categoryTotals: totals, 
      grandTotalShares, 
      grandTotalValue, 
      grandTotalInvested, 
      grandTotalProfitLoss 
    }
  }, [investmentData, investments])

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card className="bg-background">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <GlobeIcon className="mr-2 h-6 w-6" />
                {t.title}
              </CardTitle>
              <CardDescription>{t.description}</CardDescription>
            </div>
            <div className="flex space-x-2">
            <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme => theme === "dark" ? "light" : "dark")}
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <Select value={timeFrame} onValueChange={(value: TimeFrame)=> setTimeFrame(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t.timeFrame} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">{t.day}</SelectItem>
                <SelectItem value="week">{t.week}</SelectItem>
                <SelectItem value="month">{t.month}</SelectItem>
                <SelectItem value="year">{t.year}</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setSelectedChart(null)}
                className={selectedChart === null ? "bg-primary text-primary-foreground" : ""}
              >
                {t.allInvestments}
              </Button>
              {investments.map((inv) => (
                <Button
                  key={inv.name}
                  variant="outline"
                  onClick={() => setSelectedChart(inv.name)}
                  className={selectedChart === inv.name ? "bg-primary text-primary-foreground" : ""}
                >
                  {inv.name}
                </Button>
              ))}
            </div>
          </div>
          <ChartContainer
            config={{
              ...Object.fromEntries(investments.map(inv => [inv.name, { label: inv.name, color: inv.color }])),
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={aggregateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis label={{ value: t.pricePerShare, angle: -90, position: 'insideLeft' }} />
                <ChartTooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border border-border p-2 rounded shadow">
                          <p className="font-bold">{label}</p>
                          {payload.map((entry, index) => (
                            <p key={index} style={{ color: entry.color }}>
                              {entry.name}: ${Number(entry.value ?? 0).toFixed(2)}
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                {selectedChart === null
                  ? investments.map((inv) => (
                      <Line
                        key={inv.name}
                        type="monotone"
                        dataKey={inv.name}
                        stroke={inv.color}
                        name={inv.name}
                      />
                    ))
                  : <Line
                      type="monotone"
                      dataKey={selectedChart}
                      stroke={investments.find(inv => inv.name === selectedChart)?.color}
                      name={selectedChart}
                    />
                }
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="bg-background">
        <CardHeader>
          <CardTitle>{t.investmentTotals}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.investment}</TableHead>
                <TableHead>{t.totalShares}</TableHead>
                <TableHead>{t.totalValue}</TableHead>
                <TableHead>{t.totalInvested}</TableHead>
                <TableHead>{t.profitLoss}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investments.map((inv) => (
                <TableRow key={inv.name}>
                  <TableCell>{inv.name}</TableCell>
                  <TableCell>{calculateTotals.categoryTotals[inv.name].totalShares}</TableCell>
                  <TableCell>${calculateTotals.categoryTotals[inv.name].totalValue.toFixed(2)}</TableCell>
                  <TableCell>${calculateTotals.categoryTotals[inv.name].totalInvested.toFixed(2)}</TableCell>
                  <TableCell className={calculateTotals.categoryTotals[inv.name].profitLoss >= 0 ? "text-green-500" : "text-red-500"}>
                    ${calculateTotals.categoryTotals[inv.name].profitLoss.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell className="font-bold">{t.grandTotal}</TableCell>
                <TableCell className="font-bold">{calculateTotals.grandTotalShares}</TableCell>
                <TableCell className="font-bold">${calculateTotals.grandTotalValue.toFixed(2)}</TableCell>
                <TableCell className="font-bold">${calculateTotals.grandTotalInvested.toFixed(2)}</TableCell>
                <TableCell className={`font-bold ${calculateTotals.grandTotalProfitLoss >= 0 ? "text-green-500" : "text-red-500"}`}>
                  ${calculateTotals.grandTotalProfitLoss.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-background">
        <CardHeader>
          <CardTitle>{t.addInvestmentData}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addInvestmentData} className="space-y-4">
            <div className="flex space-x-2">
              <Input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                required
              />
              <Select value={newInvestment} onValueChange={setNewInvestment}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t.selectInvestment} />
                </SelectTrigger>
                <SelectContent>
                  {investments.map((inv) => (
                    <SelectItem key={inv.name} value={inv.name}>{inv.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2">
              <Input
                type="number"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder={t.investmentValue}
                required
                step="10"
              />
              <Input
                type="number"
                value={newShares}
                onChange={(e) => setNewShares(e.target.value)}
                placeholder={t.numberOfShares}
                required
                step="0.01"
              />
              <Input
                type="number"
                value={newPricePerShare}
                onChange={(e) => setNewPricePerShare(e.target.value)}
                placeholder={t.pricePerShare}
                required
                step="10"
              />
            </div>
            <Button type="submit">{t.add}</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-background">
          <CardHeader>
            <CardTitle>{t.addNewInvestment}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input
                value={newInvestmentName}
                onChange={(e) => setNewInvestmentName(e.target.value)}
                placeholder={t.investmentName}
              />
              <Input
                type="color"
                value={newInvestmentColor}
                onChange={(e) => setNewInvestmentColor(e.target.value)}
                className="w-12 p-1 h-10"
              />
              <Button onClick={addNewInvestment}>{t.add}</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background">
          <CardHeader>
            <CardTitle>{t.deleteInvestment}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Select value={deletingInvestment || ''} onValueChange={setDeletingInvestment}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t.selectInvestment} />
                </SelectTrigger>
                <SelectContent>
                  {investments.map((inv) => (
                    <SelectItem key={inv.name} value={inv.name}>{inv.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" disabled={!deletingInvestment} onClick={() => setIsDeleteModalOpen(true)}>{t.deleteInvestment}</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t.confirmDelete}</DialogTitle>
                  </DialogHeader>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => {
                      setDeletingInvestment(null)
                      setIsDeleteModalOpen(false)
                    }}>{t.no}</Button>
                    <Button variant="destructive" onClick={() => deletingInvestment && deleteInvestment(deletingInvestment)}>{t.yes}</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-background">
        <CardHeader>
          <CardTitle>{t.investmentData}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.date}</TableHead>
                {investments.map((inv) => (
                  <TableHead key={inv.name}>{inv.name}</TableHead>
                ))}
                <TableHead>{t.action}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investmentData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell>{data.date}</TableCell>
                  {investments.map((inv) => (
                    <TableCell key={inv.name}>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost">
                            ${(data[inv.name] as number)?.toFixed(2) ?? 'N/A'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <h4 className="font-medium leading-none">{inv.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {t.shares}: {(data[`${inv.name}_shares`] as number) ?? 'N/A'}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {t.totalInvested}: ${(data[`${inv.name}_invested`] as number) ?? 'N/A'}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {t.pricePerShare}: ${(data[`${inv.name}_price_per_share`] as number) ?? 'N/A'}
                              </p>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" onClick={() => {
                            editInvestmentData(data)
                            setIsEditModalOpen(true)
                          }}>{t.edit}</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>{t.editInvestmentData}</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            {editingData && (
                              <>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="edit-date" className="text-right">
                                    {t.date}
                                  </Label>
                                  <Input
                                    id="edit-date"
                                    type="date"
                                    value={editingData.date}
                                    onChange={(e) => setEditingData({...editingData, date: e.target.value})}
                                    className="col-span-3"
                                  />
                                </div>
                                {investments.map((inv) => (
                                  <div key={inv.name} className="space-y-2">
                                    <h4 className="font-medium">{inv.name}</h4>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor={`${inv.name}-value`} className="text-right">
                                        {t.investmentValue}
                                      </Label>
                                      <Input
                                        id={`${inv.name}-value`}
                                        type="number"
                                        value={editingData[inv.name] as number}
                                        onChange={(e) => setEditingData({...editingData, [inv.name]: parseFloat(e.target.value)})}
                                        className="col-span-3"
                                        step="10"
                                      />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor={`${inv.name}-shares`} className="text-right">
                                        {t.shares}
                                      </Label>
                                      <Input
                                        id={`${inv.name}-shares`}
                                        type="number"
                                        value={editingData[`${inv.name}_shares`] as number}
                                        onChange={(e) => setEditingData({...editingData, [`${inv.name}_shares`]: parseFloat(e.target.value)})}
                                        className="col-span-3"
                                        step="0.01"
                                      />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor={`${inv.name}-price-per-share`} className="text-right">
                                        {t.pricePerShare}
                                      </Label>
                                      <Input
                                        id={`${inv.name}-price-per-share`}
                                        type="number"
                                        value={editingData[`${inv.name}_price_per_share`] as number}
                                        onChange={(e) => setEditingData({...editingData, [`${inv.name}_price_per_share`]: parseFloat(e.target.value)})}
                                        className="col-span-3"
                                        step="0.01"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </>
                            )}
                          </div>
                          <Button onClick={saveEditedData}>{t.saveChanges}</Button>
                        </DialogContent>
                        </Dialog>
                        <Dialog open={isDeleteDataModalOpen} onOpenChange={setIsDeleteDataModalOpen}>
                        <DialogTrigger asChild>
                          <Button variant="destructive" onClick={() => {
                            setDeletingData(data.date)
                            setIsDeleteDataModalOpen(true)
                          }}>{t.remove}</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{t.confirmDeleteData}</DialogTitle>
                          </DialogHeader>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => {
                              setDeletingData(null)
                              setIsDeleteDataModalOpen(false)
                            }}>{t.no}</Button>
                            <Button variant="destructive" onClick={() => deletingData && removeInvestmentData(deletingData)}>{t.yes}</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

