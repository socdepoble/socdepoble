export class LoanSystem {
  constructor() {
    this.loans = new Map(); // Key: loanId, Value: loanData
  }

  createLoan(borrowerId, lenderId, item, returnCondition, dueDate) {
    const loanId = `loan-${Date.now()}`;
    const loan = {
      loanId,
      borrowerId,
      lenderId,
      item,
      returnCondition,
      dueDate,
      status: 'active',
      createdAt: Date.now(),
    };
    this.loans.set(loanId, loan);
    return loanId;
  }

  updateLoanStatus(loanId, status) {
    const loan = this.loans.get(loanId);
    if (loan) {
      loan.status = status;
      this.loans.set(loanId, loan);
      return true;
    }
    return false;
  }

  getActiveLoans() {
    return Array.from(this.loans.values()).filter(loan => loan.status === 'active');
  }

  getLoansByUser(userId) {
    return Array.from(this.loans.values()).filter(
      loan => loan.borrowerId === userId || loan.lenderId === userId
    );
  }

  resolveLoan(loanId) {
    return this.updateLoanStatus(loanId, 'resolved');
  }

  failLoan(loanId) {
    return this.updateLoanStatus(loanId, 'failed');
  }
}

export const loanSystem = new LoanSystem();
