import React from 'react';
import ApprovalTable from './ApprovalTable';

export default function ApprovalsPage() {
  return (
    <section className="mx-8 space-y-5 mt-5">
      <div>
        <h2 className="text-3xl font-bold">Pending Approvals</h2>
        <p>Review and approve courses</p>
      </div>
      <ApprovalTable />
    </section>
  );
}
