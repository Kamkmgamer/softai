# Credit Refunds

**Decision:** Undecided  
**Complexity:** Medium  
**Suggested priority:** Medium

#### Description

3aqel advertises refunds for unsatisfactory results, up to 5 times monthly, as long as the file was not downloaded.

#### Target Users

All paying users.

#### Why It Matters

AI outputs can fail. Refunds reduce perceived risk and make the credit system feel fair.

#### Softai Workflow

Users see a refund button beside eligible outputs. If they have not downloaded the output and have monthly refunds remaining, Softai reverses the credit transaction and marks the output/job as refunded.

#### Implementation Requirements

- Download tracking per output.
- Refund eligibility rules.
- Monthly refund allowance.
- Credit ledger reversal.
- Job/output refunded state.
- Abuse prevention.

#### Risks And Questions

- Users may abuse refunds if output previews are enough.
- Provider costs are still incurred.
- Need clear policy copy.

#### MVP Scope

Allow manual/admin-approved refunds first, then self-serve refunds with limits.

---
