
// import React, { useState, useEffect } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import { AppLayout } from "@/components/layout/AppLayout";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { 
//   Select, 
//   SelectContent, 
//   SelectGroup, 
//   SelectItem, 
//   SelectTrigger, 
//   SelectValue 
// } from "@/components/ui/select";
// import { Separator } from "@/components/ui/separator";
// import { ChartContainer } from "@/components/ui/chart";
// import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Info, Users, TrendingUp, Clock } from 'lucide-react';

// // Mock data for predictive analytics
// const hiringPredictionData = [
//   { month: 'Aug', actual: 8, predicted: 9 },
//   { month: 'Sep', actual: 10, predicted: 11 },
//   { month: 'Oct', actual: 12, predicted: 12 },
//   { month: 'Nov', actual: null, predicted: 15 },
//   { month: 'Dec', actual: null, predicted: 18 },
//   { month: 'Jan', actual: null, predicted: 14 },
// ];

// const attritionData = [
//   { month: 'Aug', rate: 2.1 },
//   { month: 'Sep', rate: 2.3 },
//   { month: 'Oct', rate: 2.0 },
//   { month: 'Nov', rate: 1.8 },
//   { month: 'Dec', rate: 1.5 },
//   { month: 'Jan', rate: 1.3 },
// ];

// const satisfactionPredictionData = [
//   { department: 'Engineering', current: 8.2, predictedNext: 8.5 },
//   { department: 'Marketing', current: 7.8, predictedNext: 7.9 },
//   { department: 'Sales', current: 7.4, predictedNext: 6.9 },
//   { department: 'Customer Support', current: 6.9, predictedNext: 7.2 },
//   { department: 'HR', current: 8.4, predictedNext: 8.6 },
// ];

// // Mock data for org chart
// const orgUnits = [
//   { id: 'exec', name: 'Executive', parent: null, level: 1 },
//   { id: 'hr', name: 'Human Resources', parent: 'exec', level: 2 },
//   { id: 'eng', name: 'Engineering', parent: 'exec', level: 2 },
//   { id: 'sales', name: 'Sales', parent: 'exec', level: 2 },
//   { id: 'hr-recruit', name: 'Recruitment', parent: 'hr', level: 3 },
//   { id: 'hr-dev', name: 'HR Development', parent: 'hr', level: 3 },
//   { id: 'eng-fe', name: 'Frontend', parent: 'eng', level: 3 },
//   { id: 'eng-be', name: 'Backend', parent: 'eng', level: 3 },
//   { id: 'eng-qa', name: 'QA', parent: 'eng', level: 3 },
//   { id: 'sales-domestic', name: 'Domestic', parent: 'sales', level: 3 },
//   { id: 'sales-intl', name: 'International', parent: 'sales', level: 3 },
// ];

// // Mock recent org changes
// const recentChanges = [
//   { id: 1, description: 'New QA Team created under Engineering', timestamp: '2 days ago' },
//   { id: 2, description: 'Sales team restructured with domestic/international focus', timestamp: '1 week ago' },
//   { id: 3, description: 'HR Development department expanded', timestamp: '2 weeks ago' }
// ];

// const chartConfig = {
//   hiring: {
//     label: "Hiring Trends",
//     theme: {
//       light: "#4f46e5",
//       dark: "#818cf8"
//     }
//   },
//   predicted: {
//     label: "Predicted Hiring",
//     theme: {
//       light: "#10b981",
//       dark: "#34d399"
//     }
//   },
//   attrition: {
//     label: "Attrition Rate",
//     theme: {
//       light: "#ef4444",
//       dark: "#f87171"
//     }
//   }
// };

// const HRAnalytics = () => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const tabFromUrl = searchParams.get('tab') || 'predictive';
//   const [activeTab, setActiveTab] = useState(tabFromUrl);
//   const [timeframe, setTimeframe] = useState("6m");
//   const [selectedDepartment, setSelectedDepartment] = useState("all");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     // Update URL when tab changes
//     if (activeTab !== tabFromUrl) {
//       setSearchParams({ tab: activeTab });
//     }
//   }, [activeTab, tabFromUrl, setSearchParams]);

//   const handleTabChange = (value: string) => {
//     setActiveTab(value);
//   };

//   const handleTimeframeChange = (value: string) => {
//     setTimeframe(value);
//     setLoading(true);
//     // Simulate loading data
//     setTimeout(() => {
//       setLoading(false);
//     }, 800);
//   };

//   const handleDepartmentChange = (value: string) => {
//     setSelectedDepartment(value);
//     setLoading(true);
//     // Simulate loading data
//     setTimeout(() => {
//       setLoading(false);
//     }, 800);
//   };

//   const runPrediction = () => {
//     setLoading(true);
//     // Simulate loading data
//     setTimeout(() => {
//       setLoading(false);
//     }, 1500);
//   };

//   return (
//     <AppLayout>
//       <div className="container py-6">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold">HR Analytics & Strategic Planning</h1>
//           <div className="flex gap-4">
//             <Select value={timeframe} onValueChange={handleTimeframeChange}>
//               <SelectTrigger className="w-[180px]">
//                 <SelectValue placeholder="Select timeframe" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectGroup>
//                   <SelectItem value="3m">3 Months</SelectItem>
//                   <SelectItem value="6m">6 Months</SelectItem>
//                   <SelectItem value="1y">1 Year</SelectItem>
//                 </SelectGroup>
//               </SelectContent>
//             </Select>
//             <Button className="bg-primary" onClick={runPrediction}>
//               Run Prediction
//             </Button>
//           </div>
//         </div>

//         <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
//           <TabsList className="grid w-full grid-cols-2 mb-4">
//             <TabsTrigger value="predictive">Predictive Analytics</TabsTrigger>
//             <TabsTrigger value="org-chart">Dynamic Org Chart</TabsTrigger>
//           </TabsList>
          
//           <TabsContent value="predictive" className="space-y-6">
//             <Card>
//               <CardHeader className="pb-2">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <CardTitle>Hiring & Attrition Predictions</CardTitle>
//                     <CardDescription>
//                       AI forecasts for hiring needs and attrition based on historical data.
//                     </CardDescription>
//                   </div>
//                   <Select value={selectedDepartment} onValueChange={handleDepartmentChange}>
//                     <SelectTrigger className="w-[180px]">
//                       <SelectValue placeholder="Select department" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectGroup>
//                         <SelectItem value="all">All Departments</SelectItem>
//                         <SelectItem value="eng">Engineering</SelectItem>
//                         <SelectItem value="sales">Sales</SelectItem>
//                         <SelectItem value="marketing">Marketing</SelectItem>
//                         <SelectItem value="support">Customer Support</SelectItem>
//                         <SelectItem value="hr">HR</SelectItem>
//                       </SelectGroup>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 {loading ? (
//                   <div className="space-y-4">
//                     <Skeleton className="h-80 w-full" />
//                     <div className="grid gap-4 grid-cols-3">
//                       <Skeleton className="h-24 w-full" />
//                       <Skeleton className="h-24 w-full" />
//                       <Skeleton className="h-24 w-full" />
//                     </div>
//                   </div>
//                 ) : (
//                   <>
//                     <div className="h-80 mb-6">
//                       <ChartContainer config={chartConfig}>
//                         <ResponsiveContainer width="100%" height="100%">
//                           <BarChart data={hiringPredictionData}>
//                             <CartesianGrid strokeDasharray="3 3" />
//                             <XAxis dataKey="month" />
//                             <YAxis />
//                             <Tooltip />
//                             <Legend />
//                             <Bar dataKey="actual" name="Actual Hiring" fill="var(--color-hiring)" />
//                             <Bar dataKey="predicted" name="Predicted Hiring" fill="var(--color-predicted)" />
//                           </BarChart>
//                         </ResponsiveContainer>
//                       </ChartContainer>
//                     </div>

//                     <Separator className="my-6" />

//                     <div className="mb-4">
//                       <h3 className="text-lg font-medium mb-4">Attrition Rate Trends</h3>
//                       <div className="h-52">
//                         <ChartContainer config={chartConfig}>
//                           <ResponsiveContainer width="100%" height="100%">
//                             <LineChart data={attritionData}>
//                               <CartesianGrid strokeDasharray="3 3" />
//                               <XAxis dataKey="month" />
//                               <YAxis domain={[0, 5]} />
//                               <Tooltip />
//                               <Legend />
//                               <Line 
//                                 type="monotone" 
//                                 dataKey="rate" 
//                                 name="Attrition Rate (%)" 
//                                 stroke="var(--color-attrition)" 
//                                 strokeWidth={2}
//                               />
//                             </LineChart>
//                           </ResponsiveContainer>
//                         </ChartContainer>
//                       </div>
//                     </div>

//                     <Separator className="my-6" />

//                     <div>
//                       <h3 className="text-lg font-medium mb-4">Employee Satisfaction Forecast</h3>
//                       <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
//                         {satisfactionPredictionData.map((dept) => (
//                           <Card key={dept.department}>
//                             <CardHeader className="pb-2">
//                               <CardTitle className="text-base font-medium">{dept.department}</CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                               <div className="flex justify-between">
//                                 <div>
//                                   <p className="text-sm text-muted-foreground">Current</p>
//                                   <p className="text-2xl font-bold">{dept.current}</p>
//                                 </div>
//                                 <div className="text-right">
//                                   <p className="text-sm text-muted-foreground">Predicted</p>
//                                   <div className="flex items-center">
//                                     <p className="text-2xl font-bold">{dept.predictedNext}</p>
//                                     <Badge 
//                                       variant={dept.predictedNext >= dept.current ? "default" : "destructive"}
//                                       className="ml-2"
//                                     >
//                                       {dept.predictedNext >= dept.current ? "↑" : "↓"}
//                                     </Badge>
//                                   </div>
//                                 </div>
//                               </div>
//                             </CardContent>
//                           </Card>
//                         ))}
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="org-chart" className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <CardTitle>Dynamic Organization Chart</CardTitle>
//                     <CardDescription>
//                       AI-updated organizational structure based on real-time data.
//                     </CardDescription>
//                   </div>
//                   <Button variant="outline">Auto-Optimize Structure</Button>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 {loading ? (
//                   <Skeleton className="h-[500px] w-full" />
//                 ) : (
//                   <div className="space-y-6">
//                     <div className="border rounded-lg p-4 bg-muted/30">
//                       {/* Simple visualization of org chart */}
//                       <div className="flex flex-col items-center">
//                         {/* Level 1 */}
//                         <div className="mb-6">
//                           {orgUnits.filter(unit => unit.level === 1).map(unit => (
//                             <div 
//                               key={unit.id} 
//                               className="px-4 py-2 bg-primary text-primary-foreground rounded-md shadow-sm"
//                             >
//                               {unit.name}
//                             </div>
//                           ))}
//                         </div>
                        
//                         {/* Level 2 */}
//                         <div className="flex justify-center gap-8 mb-6">
//                           {orgUnits.filter(unit => unit.level === 2).map(unit => (
//                             <div key={unit.id} className="flex flex-col items-center">
//                               <div className="w-px h-4 bg-muted-foreground/50 mb-2"></div>
//                               <div className="px-4 py-2 bg-card border rounded-md shadow-sm">
//                                 {unit.name}
//                               </div>
//                             </div>
//                           ))}
//                         </div>
                        
//                         {/* Level 3 */}
//                         <div className="flex justify-center flex-wrap gap-4">
//                           {orgUnits.filter(unit => unit.level === 3).map(unit => {
//                             const parentIndex = orgUnits.findIndex(parent => parent.id === unit.parent);
//                             const parentOffset = parentIndex !== -1 ? parentIndex - 1 : 0;
                            
//                             return (
//                               <div 
//                                 key={unit.id} 
//                                 className="flex flex-col items-center"
//                                 style={{ marginLeft: `${parentOffset * 20}px` }}
//                               >
//                                 <div className="w-px h-4 bg-muted-foreground/50 mb-2"></div>
//                                 <div className="px-3 py-1.5 bg-muted border border-border rounded-md text-sm">
//                                   {unit.name}
//                                 </div>
//                               </div>
//                             );
//                           })}
//                         </div>
//                       </div>
                      
//                       <div className="mt-8 text-center text-sm text-muted-foreground">
//                         <p>This is a simplified visualization. Click "View Full Chart" for interactive display.</p>
//                       </div>
//                     </div>
                    
//                     <div className="flex justify-center mt-4">
//                       <Button variant="outline" className="w-full sm:w-auto">View Full Chart</Button>
//                     </div>
                    
//                     <Separator />
                    
//                     <div>
//                       <h3 className="text-lg font-medium mb-4 flex items-center">
//                         <Clock className="w-4 h-4 mr-2" />
//                         Recent Organizational Changes
//                       </h3>
                      
//                       <div className="space-y-3">
//                         {recentChanges.map(change => (
//                           <Card key={change.id}>
//                             <CardContent className="p-4 flex items-start">
//                               <div className="mr-4 mt-1">
//                                 <div className="p-1.5 rounded-full bg-blue-100">
//                                   <Info className="w-4 h-4 text-blue-500" />
//                                 </div>
//                               </div>
//                               <div>
//                                 <p className="font-medium">{change.description}</p>
//                                 <p className="text-sm text-muted-foreground">{change.timestamp}</p>
//                               </div>
//                             </CardContent>
//                           </Card>
//                         ))}
//                       </div>
//                     </div>
                    
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       <Card>
//                         <CardContent className="p-4 flex items-center">
//                           <div className="p-2 rounded-full bg-primary/10 mr-4">
//                             <Users className="w-5 h-5 text-primary" />
//                           </div>
//                           <div>
//                             <p className="text-sm text-muted-foreground">Total Teams</p>
//                             <p className="text-2xl font-bold">11</p>
//                           </div>
//                         </CardContent>
//                       </Card>
                      
//                       <Card>
//                         <CardContent className="p-4 flex items-center">
//                           <div className="p-2 rounded-full bg-primary/10 mr-4">
//                             <TrendingUp className="w-5 h-5 text-primary" />
//                           </div>
//                           <div>
//                             <p className="text-sm text-muted-foreground">Org Changes (30d)</p>
//                             <p className="text-2xl font-bold">+3</p>
//                           </div>
//                         </CardContent>
//                       </Card>
                      
//                       <Card>
//                         <CardContent className="p-4 flex items-center">
//                           <div className="p-2 rounded-full bg-green-100 mr-4">
//                             <Info className="w-5 h-5 text-green-500" />
//                           </div>
//                           <div>
//                             <p className="text-sm text-muted-foreground">Efficiency Score</p>
//                             <p className="text-2xl font-bold">8.4</p>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </AppLayout>
//   );
// };

// export default HRAnalytics;
