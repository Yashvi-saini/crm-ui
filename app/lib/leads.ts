export type Status = "New" | "Contacted" | "Proposal Sent" | "Won" | "Lost";

export const STATUSES: Status[] = ["New", "Contacted", "Proposal Sent", "Won", "Lost"];
export const SOURCES = ["Website", "Referral", "Social Media", "Email", "Other"] as const;
export const TEAM = ["Ananya Rao", "Rahul Mehta", "Sara Thomas", "Vikram Shah"] as const;

export type Lead = {
  id: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  source: (typeof SOURCES)[number];
  status: Status;
  assignee: string;
  followUp: string;
  lastContact: string;
  notes: string;
};

export const SEED_LEADS: Lead[] = [
  { id: "LEAD-001", company: "Bright Ideas Co.", contact: "Sarah Johnson", email: "sarah@brightideas.co", phone: "(555) 123-4567", source: "Website", status: "New", assignee: "Ananya Rao", followUp: "2026-10-12", lastContact: "2026-10-05", notes: "Interested in packages" },
  { id: "LEAD-002", company: "Summit Consulting", contact: "Michael Lee", email: "michael@summit.com", phone: "(555) 234-5678", source: "Referral", status: "Contacted", assignee: "Rahul Mehta", followUp: "2026-10-14", lastContact: "2026-10-08", notes: "Sent intro email" },
  { id: "LEAD-003", company: "Creative Studio", contact: "Emily Davis", email: "emily@creativestudio.com", phone: "(555) 345-6789", source: "Social Media", status: "Proposal Sent", assignee: "Sara Thomas", followUp: "2026-10-16", lastContact: "2026-10-07", notes: "Proposal sent" },
  { id: "LEAD-004", company: "Northwest Partners", contact: "David Brown", email: "david@nwpartners.com", phone: "(555) 456-7890", source: "Website", status: "Won", assignee: "Ananya Rao", followUp: "", lastContact: "2026-10-01", notes: "Onboarding scheduled" },
  { id: "LEAD-005", company: "Evergreen Co.", contact: "Jessica White", email: "jessica@evergreen.co", phone: "(555) 567-8901", source: "Website", status: "Contacted", assignee: "Vikram Shah", followUp: "2026-10-09", lastContact: "2026-10-03", notes: "Waiting on info" },
  { id: "LEAD-006", company: "Momentum Group", contact: "James Wilson", email: "james@momentum.com", phone: "(555) 678-9012", source: "Referral", status: "Lost", assignee: "Rahul Mehta", followUp: "", lastContact: "2026-09-26", notes: "No response yet" },
  { id: "LEAD-007", company: "Lumen Collective", contact: "Olivia Martin", email: "olivia@lumencollective.com", phone: "(555) 789-0123", source: "Social Media", status: "Contacted", assignee: "Sara Thomas", followUp: "2026-10-13", lastContact: "2026-10-06", notes: "Following up" },
  { id: "LEAD-008", company: "Pioneer Works", contact: "Daniel Taylor", email: "daniel@pioneerworks.com", phone: "(555) 890-1234", source: "Referral", status: "Won", assignee: "Vikram Shah", followUp: "", lastContact: "2026-09-30", notes: "Project kick-off 17 May" },
  { id: "LEAD-009", company: "Atlas Solutions", contact: "Sophia Clark", email: "sophia@atlassolutions.com", phone: "(555) 901-2345", source: "Email", status: "Proposal Sent", assignee: "Ananya Rao", followUp: "2026-10-18", lastContact: "2026-10-04", notes: "Requested pricing" },
  { id: "LEAD-010", company: "Peak Performance", contact: "Ryan Anderson", email: "ryan@peakperformance.com", phone: "(555) 012-3456", source: "Other", status: "New", assignee: "Rahul Mehta", followUp: "2026-10-11", lastContact: "2026-10-09", notes: "Initial inquiry" },
  { id: "LEAD-011", company: "Harbor & Finch", contact: "Priya Nair", email: "priya@harborfinch.com", phone: "(555) 112-2334", source: "Email", status: "New", assignee: "Sara Thomas", followUp: "2026-10-15", lastContact: "2026-10-09", notes: "Asked for a demo" },
  { id: "LEAD-012", company: "Bluepoint Labs", contact: "Karan Verma", email: "karan@bluepointlabs.com", phone: "(555) 223-3445", source: "Website", status: "Proposal Sent", assignee: "Vikram Shah", followUp: "2026-10-10", lastContact: "2026-10-02", notes: "Reviewing proposal" },
];
