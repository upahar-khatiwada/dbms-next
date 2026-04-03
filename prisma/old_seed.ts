import { TransactionType } from "../generated/prisma/enums.js";
import { prisma } from "../lib/prisma.js";

async function main() {
  const transactionTypes = [
    TransactionType.DEPOSIT,
    TransactionType.WITHDRAWAL,
    TransactionType.TRANSFER,
    TransactionType.PAYMENT,
  ];

  // ── Branches ────────────────────────────────────────────────────────────────
  const branches = await Promise.all([
    prisma.branch.create({
      data: { name: "New Road Branch", address: "New Road, Kathmandu" },
    }),
    prisma.branch.create({
      data: { name: "Lalitpur Branch", address: "Pulchowk, Lalitpur" },
    }),
    prisma.branch.create({
      data: { name: "Dhumbarahi Branch", address: "Dhumbarahi, Kathmandu" },
    }),
    prisma.branch.create({
      data: { name: "Bhaktapur Branch", address: "Sukuldhoka, Bhaktapur" },
    }),
    prisma.branch.create({
      data: { name: "Baneshwor Branch", address: "Baneshwor, Kathmandu" },
    }),
  ]);

  // ── Employees ────────────────────────────────────────────────────────────────
  const employees = await Promise.all([
    prisma.employee.create({
      data: {
        name: "Aarav Shrestha",
        address: "Dhumbarahi, Kathmandu",
        salary: 55000,
        branchId: branches[0].branchId,
      },
    }),
    prisma.employee.create({
      data: {
        name: "Sita Tamang",
        address: "Balaju, Kathmandu",
        salary: 62000,
        branchId: branches[0].branchId,
      },
    }),
    prisma.employee.create({
      data: {
        name: "Bikash Maharjan",
        address: "Pulchowk, Lalitpur",
        salary: 58000,
        branchId: branches[1].branchId,
      },
    }),
    prisma.employee.create({
      data: {
        name: "Anita Karki",
        address: "Sukuldhoka, Bhaktapur",
        salary: 67000,
        branchId: branches[2].branchId,
      },
    }),
    prisma.employee.create({
      data: {
        name: "Roshan Basnet",
        address: "Baneshwor, Kathmandu",
        salary: 72000,
        branchId: branches[3].branchId,
      },
    }),
    prisma.employee.create({
      data: {
        name: "Priya Gurung",
        address: "Koteshwor, Kathmandu",
        salary: 49000,
        branchId: branches[4].branchId,
      },
    }),
    prisma.employee.create({
      data: {
        name: "Suraj Thapa",
        address: "Bhaisepati, Lalitpur",
        salary: 53000,
        branchId: branches[4].branchId,
      },
    }),
  ]);

  // ── Employee phones ──────────────────────────────────────────────────────────
  await prisma.employeePhone.createMany({
    data: [
      { employeeId: employees[0].employeeId, phoneNumber: "9841-100001" },
      { employeeId: employees[1].employeeId, phoneNumber: "9841-100002" },
      { employeeId: employees[1].employeeId, phoneNumber: "9801-100003" }, // multiple phones
      { employeeId: employees[2].employeeId, phoneNumber: "9851-100004" },
      { employeeId: employees[3].employeeId, phoneNumber: "9841-100005" },
      { employeeId: employees[4].employeeId, phoneNumber: "9861-100006" },
      { employeeId: employees[5].employeeId, phoneNumber: "9841-100007" },
      { employeeId: employees[6].employeeId, phoneNumber: "9801-100008" },
    ],
  });

  // ── Customers ────────────────────────────────────────────────────────────────
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: "Ramesh Adhikari",
        address: "Lazimpat, Kathmandu",
        dateOfBirth: new Date("1990-03-15"),
        branchId: branches[0].branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Sunita Magar",
        address: "Kupondole, Lalitpur",
        dateOfBirth: new Date("1985-07-22"),
        branchId: branches[1].branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Dipesh Rai",
        address: "Chabahil, Kathmandu",
        dateOfBirth: new Date("1992-11-08"),
        branchId: branches[2].branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Kamala Poudel",
        address: "Sukuldhoka, Bhaktapur",
        dateOfBirth: new Date("1988-01-30"),
        branchId: branches[3].branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Nirajan Bajracharya",
        address: "Dhumbarahi, Kathmandu",
        dateOfBirth: new Date("1995-06-18"),
        branchId: branches[0].branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Puja Lama",
        address: "Imadol, Lalitpur",
        dateOfBirth: new Date("1993-09-25"),
        branchId: branches[4].branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Sagar Pandey",
        address: "Baluwatar, Kathmandu",
        dateOfBirth: new Date("1980-12-05"),
        branchId: branches[2].branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Manisha Khadka",
        address: "Koteshwor, Kathmandu",
        dateOfBirth: new Date("1997-04-14"),
        branchId: branches[3].branchId,
      },
    }),
  ]);

  // ── Customer phones ──────────────────────────────────────────────────────────
  await prisma.customerPhone.createMany({
    data: [
      { customerId: customers[0].customerId, phoneNumber: "9841-200001" },
      { customerId: customers[1].customerId, phoneNumber: "9851-200002" },
      { customerId: customers[1].customerId, phoneNumber: "9801-200003" }, // multiple phones
      { customerId: customers[2].customerId, phoneNumber: "9841-200004" },
      { customerId: customers[3].customerId, phoneNumber: "9861-200005" },
      { customerId: customers[4].customerId, phoneNumber: "9841-200006" },
      { customerId: customers[4].customerId, phoneNumber: "9801-200007" }, // multiple phones
      { customerId: customers[5].customerId, phoneNumber: "9851-200008" },
      { customerId: customers[6].customerId, phoneNumber: "9841-200009" },
      { customerId: customers[7].customerId, phoneNumber: "9801-200010" },
    ],
  });

  // ── Accounts ─────────────────────────────────────────────────────────────────
  const accounts = await Promise.all([
    prisma.account.create({ data: { balance: 50000.0 } }),
    prisma.account.create({ data: { balance: 125000.5 } }),
    prisma.account.create({ data: { balance: 32000.75 } }),
    prisma.account.create({ data: { balance: 870000.0 } }),
    prisma.account.create({ data: { balance: 4500.25 } }),
    prisma.account.create({ data: { balance: 230000.0 } }),
    prisma.account.create({ data: { balance: 67500.9 } }),
    prisma.account.create({ data: { balance: 150000.0 } }),
    prisma.account.create({ data: { balance: 9000.0 } }),
    prisma.account.create({ data: { balance: 420000.0 } }),
  ]);

  // ── Customer <-> Account (junction) ─────────────────────────────────────────
  await prisma.customerAccount.createMany({
    data: [
      { customerId: customers[0].customerId, accNo: accounts[0].accNo },
      { customerId: customers[0].customerId, accNo: accounts[1].accNo }, // customer with 2 accounts
      { customerId: customers[1].customerId, accNo: accounts[2].accNo },
      { customerId: customers[2].customerId, accNo: accounts[3].accNo },
      { customerId: customers[3].customerId, accNo: accounts[4].accNo },
      { customerId: customers[3].customerId, accNo: accounts[5].accNo }, // customer with 2 accounts
      { customerId: customers[4].customerId, accNo: accounts[6].accNo },
      { customerId: customers[5].customerId, accNo: accounts[7].accNo },
      { customerId: customers[6].customerId, accNo: accounts[8].accNo },
      { customerId: customers[7].customerId, accNo: accounts[9].accNo },
      { customerId: customers[1].customerId, accNo: accounts[9].accNo }, // shared account
    ],
  });

  // ── Loans ────────────────────────────────────────────────────────────────────
  const loans = await Promise.all([
    prisma.loan.create({ data: { amount: 100000.0 } }),
    prisma.loan.create({ data: { amount: 250000.0 } }),
    prisma.loan.create({ data: { amount: 50000.0 } }),
    prisma.loan.create({ data: { amount: 1500000.0 } }),
    prisma.loan.create({ data: { amount: 80000.0 } }),
    prisma.loan.create({ data: { amount: 500000.0 } }),
  ]);

  // ── Customer <-> Loan (junction) ─────────────────────────────────────────────
  await prisma.customerLoan.createMany({
    data: [
      { customerId: customers[0].customerId, loanId: loans[0].loanId },
      { customerId: customers[1].customerId, loanId: loans[1].loanId },
      { customerId: customers[2].customerId, loanId: loans[2].loanId },
      { customerId: customers[2].customerId, loanId: loans[3].loanId }, // customer with 2 loans
      { customerId: customers[3].customerId, loanId: loans[4].loanId },
      { customerId: customers[4].customerId, loanId: loans[5].loanId },
      { customerId: customers[5].customerId, loanId: loans[0].loanId }, // shared loan
      { customerId: customers[6].customerId, loanId: loans[2].loanId },
    ],
  });

  // ── Transactions ──────────────────────────────────────────────────────────────
  await prisma.transaction.createMany({
    data: [
      {
        accNo: accounts[0].accNo,
        type: TransactionType.DEPOSIT,
        amount: 10000.0,
        date: new Date("2024-01-05"),
      },
      {
        accNo: accounts[0].accNo,
        type: TransactionType.WITHDRAWAL,
        amount: 2000.0,
        date: new Date("2024-01-10"),
      },
      {
        accNo: accounts[1].accNo,
        type: TransactionType.DEPOSIT,
        amount: 50000.0,
        date: new Date("2024-01-15"),
      },
      {
        accNo: accounts[1].accNo,
        type: TransactionType.TRANSFER,
        amount: 15000.0,
        date: new Date("2024-01-20"),
      },
      {
        accNo: accounts[2].accNo,
        type: TransactionType.PAYMENT,
        amount: 3000.0,
        date: new Date("2024-02-01"),
      },
      {
        accNo: accounts[3].accNo,
        type: TransactionType.DEPOSIT,
        amount: 200000.0,
        date: new Date("2024-02-05"),
      },
      {
        accNo: accounts[3].accNo,
        type: TransactionType.WITHDRAWAL,
        amount: 50000.0,
        date: new Date("2024-02-10"),
      },
      {
        accNo: accounts[4].accNo,
        type: TransactionType.PAYMENT,
        amount: 1500.0,
        date: new Date("2024-02-15"),
      },
      {
        accNo: accounts[5].accNo,
        type: TransactionType.TRANSFER,
        amount: 30000.0,
        date: new Date("2024-03-01"),
      },
      {
        accNo: accounts[6].accNo,
        type: TransactionType.DEPOSIT,
        amount: 7500.0,
        date: new Date("2024-03-05"),
      },
      {
        accNo: accounts[7].accNo,
        type: TransactionType.WITHDRAWAL,
        amount: 20000.0,
        date: new Date("2024-03-10"),
      },
      {
        accNo: accounts[8].accNo,
        type: TransactionType.PAYMENT,
        amount: 5000.0,
        date: new Date("2024-03-15"),
      },
      {
        accNo: accounts[9].accNo,
        type: TransactionType.DEPOSIT,
        amount: 100000.0,
        date: new Date("2024-03-20"),
      },
      {
        accNo: accounts[9].accNo,
        type: TransactionType.TRANSFER,
        amount: 25000.0,
        date: new Date("2024-03-25"),
      },
    ],
  });

  // ── Bulk dataset for meaningful grouping/aggregation ───────────────────────
  const extraCustomers = await Promise.all(
    Array.from({ length: 40 }, (_, i) => {
      const index = i + 1;
      const year = 1980 + (index % 20);
      const month = (index % 12) + 1;
      const day = (index % 28) + 1;

      return prisma.customer.create({
        data: {
          name: `Customer ${index}`,
          address: `Ward ${((index - 1) % 10) + 1}, Kathmandu`,
          dateOfBirth: new Date(
            `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
          ),
          branchId: branches[i % branches.length].branchId,
        },
      });
    }),
  );

  await prisma.customerPhone.createMany({
    data: extraCustomers.map((customer, i) => ({
      customerId: customer.customerId,
      phoneNumber: `98${(40 + (i % 50)).toString().padStart(2, "0")}-30${String(i + 1).padStart(4, "0")}`,
    })),
  });

  const extraAccounts = await Promise.all(
    Array.from({ length: 80 }, (_, i) =>
      prisma.account.create({
        data: {
          balance: 1000 + (i % 25) * 4000 + i * 175,
        },
      }),
    ),
  );

  const extraCustomerAccounts = extraAccounts.map((account, i) => ({
    customerId: extraCustomers[i % extraCustomers.length].customerId,
    accNo: account.accNo,
  }));

  await prisma.customerAccount.createMany({
    data: extraCustomerAccounts,
  });

  const extraLoans = await Promise.all(
    Array.from({ length: 30 }, (_, i) =>
      prisma.loan.create({
        data: {
          amount: 25000 + i * 15000,
        },
      }),
    ),
  );

  await prisma.customerLoan.createMany({
    data: extraLoans.map((loan, i) => ({
      customerId: extraCustomers[i % extraCustomers.length].customerId,
      loanId: loan.loanId,
    })),
  });

  const extraTransactions = extraAccounts.flatMap((account, i) =>
    Array.from({ length: 3 }, (_, j) => {
      const txIndex = i * 3 + j;
      const month = (txIndex % 12) + 1;
      const day = (txIndex % 28) + 1;

      return {
        accNo: account.accNo,
        type: transactionTypes[txIndex % transactionTypes.length],
        amount: 500 + (txIndex % 18) * 850 + j * 100,
        date: new Date(
          `2024-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        ),
      };
    }),
  );

  await prisma.transaction.createMany({
    data: extraTransactions,
  });

  console.log("✅ Seeding complete!");
  console.log(`   ${branches.length} branches`);
  console.log(`   ${employees.length} employees`);
  console.log(`   ${customers.length + extraCustomers.length} customers`);
  console.log(`   ${accounts.length + extraAccounts.length} accounts`);
  console.log(`   ${loans.length + extraLoans.length} loans`);
  console.log(`   ${14 + extraTransactions.length} transactions`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
