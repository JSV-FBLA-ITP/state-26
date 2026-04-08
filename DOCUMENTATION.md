# Program Documentation: PetPal (FBLA 2025-2026)

## Purpose of the Program
PetPal is an interactive financial literacy application designed to teach young students the basics of budgeting, saving, and financial responsibility through virtual pet ownership. By managing the "cost of care," users learn that every decision has a financial consequence.

## Operating Instructions
1. **Onboarding**: Start by choosing a pet type and naming your companion. Set up your "household" with a simulated monthly income and expenses to establish your starting balance.
2. **Dashboard**: Care for your pet by Feeding, Playing, Training, or performing Health Checks. Each action costs money from your virtual wallet.
3. **Monthly Cycle**: Progress through months to earn your income. Beware of "Vet Emergencies"—random expenses that test your emergency fund!
4. **Learning**: Complete the monthly Financial Literacy Quiz to earn bonus cash and test your knowledge.
5. **Growth**: As you interact and train your pet, it will age and learn new tricks (displayed in the Evolution History).
6. **Financial Tracking**: Visit the Statistics page to view a detailed ledger of all expenses categorized by type (Food, Health, etc.) and monitor your budget health.

## Technologies Used
- **Frontend**: Next.js 15, React 19, Tailwind CSS.
- **Animations**: Framer Motion, React Three Fiber (3D Pet Rendering).
- **Backend/Storage**: Supabase (PostgreSQL, Auth), LocalStorage fallback.
- **Icons/UI**: Lucide React, Shadcn/UI patterns.

## Design Decisions
- **3D Interaction**: Used React Three Fiber for the pet model to provide a modern, engaging "WOW" factor.
- **Dynamic Growth**: Implementation of an `age` property that scales the 3D model, simulating growth as the user progresses.
- **Budget Guardrails**: A budget limit system provides real-time feedback when spending exceeds planned limits, simulating real-world credit/debit alerts.
- **Category Breakdown**: Categorized expenses allow users to see exactly where their "money" goes, reflecting standard accounting practices.

## Validation & Error Handling
- Comprehensive input validation for pet naming and financial settings.
- Graceful fallbacks for network connectivity using LocalStorage persistence.
- User-friendly error messages (Feedback system) for actions like "insufficient funds."
