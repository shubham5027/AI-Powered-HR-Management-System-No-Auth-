
// import React from 'react';
// import { AppLayout } from '@/components/layout/AppLayout';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { useForm } from 'react-hook-form';
// import { toast } from 'sonner';

// const Support = () => {
//   const contactForm = useForm();

//   const handleSubmit = () => {
//     toast.success('Support ticket submitted successfully!');
//     contactForm.reset();
//   };

//   return (
//     <AppLayout>
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <h1 className="h2">Help & Support</h1>
//         </div>

//         <Tabs defaultValue="faqs" className="space-y-4">
//           <TabsList>
//             <TabsTrigger value="faqs">FAQs</TabsTrigger>
//             <TabsTrigger value="contact">Contact Support</TabsTrigger>
//             <TabsTrigger value="documentation">Documentation</TabsTrigger>
//           </TabsList>

//           <TabsContent value="faqs">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Frequently Asked Questions</CardTitle>
//                 <CardDescription>
//                   Find quick answers to common questions about NexusHR.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Accordion type="single" collapsible className="w-full">
//                   <AccordionItem value="item-1">
//                     <AccordionTrigger>
//                       How do I add a new employee to the system?
//                     </AccordionTrigger>
//                     <AccordionContent>
//                       To add a new employee, go to the Employees page and click the "Add Employee" button
//                       in the top right corner. Fill out all required fields and submit the form.
//                     </AccordionContent>
//                   </AccordionItem>
//                   <AccordionItem value="item-2">
//                     <AccordionTrigger>
//                       How does the AI recruitment screening work?
//                     </AccordionTrigger>
//                     <AccordionContent>
//                       Our AI recruitment screening uses natural language processing to analyze resumes
//                       and cover letters, matching them against job requirements. The system ranks candidates
//                       based on qualifications, experience, and culture fit.
//                     </AccordionContent>
//                   </AccordionItem>
//                   <AccordionItem value="item-3">
//                     <AccordionTrigger>
//                       Can I customize onboarding documents?
//                     </AccordionTrigger>
//                     <AccordionContent>
//                       Yes, you can customize onboarding documents in the Onboarding settings section.
//                       You can create templates for different roles and departments, and set up
//                       automated workflows.
//                     </AccordionContent>
//                   </AccordionItem>
//                   <AccordionItem value="item-4">
//                     <AccordionTrigger>
//                       How do I reset my password?
//                     </AccordionTrigger>
//                     <AccordionContent>
//                       To reset your password, go to the Settings page and select the "Security" tab.
//                       Enter your current password and then set a new password.
//                     </AccordionContent>
//                   </AccordionItem>
//                   <AccordionItem value="item-5">
//                     <AccordionTrigger>
//                       How does the AI sentiment analysis work?
//                     </AccordionTrigger>
//                     <AccordionContent>
//                       The AI sentiment analysis tool processes feedback from employee surveys,
//                       communication channels, and other data sources to gauge overall employee morale
//                       and identify potential issues before they escalate.
//                     </AccordionContent>
//                   </AccordionItem>
//                 </Accordion>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="contact">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Contact Support</CardTitle>
//                 <CardDescription>
//                   Need additional help? Submit a support ticket and our team will respond within 24 hours.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <form onSubmit={contactForm.handleSubmit(handleSubmit)} className="space-y-4">
//                   <div className="space-y-2">
//                     <label htmlFor="subject" className="text-sm font-medium">Subject</label>
//                     <Input id="subject" placeholder="Brief description of your issue" />
//                   </div>
//                   <div className="space-y-2">
//                     <label htmlFor="category" className="text-sm font-medium">Category</label>
//                     <select id="category" className="w-full p-2 border rounded">
//                       <option>Technical Issue</option>
//                       <option>Billing Question</option>
//                       <option>Feature Request</option>
//                       <option>Other</option>
//                     </select>
//                   </div>
//                   <div className="space-y-2">
//                     <label htmlFor="message" className="text-sm font-medium">Message</label>
//                     <Textarea id="message" placeholder="Describe your issue in detail" rows={5} />
//                   </div>
//                   <Button type="submit">Submit Ticket</Button>
//                 </form>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="documentation">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Documentation</CardTitle>
//                 <CardDescription>
//                   Access comprehensive guides and tutorials for NexusHR.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid gap-4 md:grid-cols-2">
//                   <Card>
//                     <CardHeader className="pb-2">
//                       <CardTitle className="text-lg">Getting Started Guide</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <p className="text-sm text-muted-foreground">
//                         Learn the basics of using NexusHR and set up your organization.
//                       </p>
//                       <Button variant="outline" className="mt-4 w-full">View Guide</Button>
//                     </CardContent>
//                   </Card>
//                   <Card>
//                     <CardHeader className="pb-2">
//                       <CardTitle className="text-lg">Administrator Manual</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <p className="text-sm text-muted-foreground">
//                         Advanced configuration and administration options.
//                       </p>
//                       <Button variant="outline" className="mt-4 w-full">View Manual</Button>
//                     </CardContent>
//                   </Card>
//                   <Card>
//                     <CardHeader className="pb-2">
//                       <CardTitle className="text-lg">HR Best Practices</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <p className="text-sm text-muted-foreground">
//                         Guides and templates for common HR processes.
//                       </p>
//                       <Button variant="outline" className="mt-4 w-full">View Resources</Button>
//                     </CardContent>
//                   </Card>
//                   <Card>
//                     <CardHeader className="pb-2">
//                       <CardTitle className="text-lg">API Documentation</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <p className="text-sm text-muted-foreground">
//                         Technical guides for developers integrating with NexusHR.
//                       </p>
//                       <Button variant="outline" className="mt-4 w-full">View API Docs</Button>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </AppLayout>
//   );
// };

// export default Support;
