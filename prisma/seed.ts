import { TransactionType } from "../generated/prisma/enums.js";
import { prisma } from "../lib/prisma.js";

async function main() {
  // ── Wipe existing data (order matters for FK constraints) ──────────────────
  await prisma.transaction.deleteMany();
  await prisma.customerAccount.deleteMany();
  await prisma.customerLoan.deleteMany();
  await prisma.customerPhone.deleteMany();
  await prisma.employeePhone.deleteMany();
  await prisma.account.deleteMany();
  await prisma.loan.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.branch.deleteMany();

  // ── Branches ───────────────────────────────────────────────────────────────
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

  const [newRoad, lalitpur, dhumbarahi, bhaktapur, baneshwor] = branches;

  // ── Employees ──────────────────────────────────────────────────────────────
  const employees = await Promise.all([
    prisma.employee.create({
      data: {
        name: "Aarav Shrestha",
        address: "Dhumbarahi, Kathmandu",
        salary: 55000,
        branchId: newRoad.branchId,
      },
    }),
    prisma.employee.create({
      data: {
        name: "Sita Tamang",
        address: "Balaju, Kathmandu",
        salary: 62000,
        branchId: newRoad.branchId,
      },
    }),
    prisma.employee.create({
      data: {
        name: "Bikash Maharjan",
        address: "Pulchowk, Lalitpur",
        salary: 48000,
        branchId: lalitpur.branchId,
      },
    }),
    prisma.employee.create({
      data: {
        name: "Anita Karki",
        address: "Imadol, Lalitpur",
        salary: 71000,
        branchId: lalitpur.branchId,
      },
    }),
    prisma.employee.create({
      data: {
        name: "Roshan Basnet",
        address: "Chabahil, Kathmandu",
        salary: 67000,
        branchId: dhumbarahi.branchId,
      },
    }),
    prisma.employee.create({
      data: {
        name: "Priya Gurung",
        address: "Koteshwor, Kathmandu",
        salary: 49000,
        branchId: bhaktapur.branchId,
      },
    }),
    prisma.employee.create({
      data: {
        name: "Suraj Thapa",
        address: "Bhaisepati, Lalitpur",
        salary: 53000,
        branchId: baneshwor.branchId,
      },
    }),
    prisma.employee.create({
      data: {
        name: "Nisha Pandey",
        address: "Baneshwor, Kathmandu",
        salary: 44000,
        branchId: baneshwor.branchId,
      },
    }),
  ]);

  await prisma.employeePhone.createMany({
    data: [
      { employeeId: employees[0].employeeId, phoneNumber: "9841-100001" },
      { employeeId: employees[1].employeeId, phoneNumber: "9841-100002" },
      { employeeId: employees[1].employeeId, phoneNumber: "9801-100003" }, // two phones
      { employeeId: employees[2].employeeId, phoneNumber: "9851-100004" },
      { employeeId: employees[3].employeeId, phoneNumber: "9841-100005" },
      { employeeId: employees[3].employeeId, phoneNumber: "9801-100006" }, // two phones
      { employeeId: employees[4].employeeId, phoneNumber: "9861-100007" },
      { employeeId: employees[5].employeeId, phoneNumber: "9841-100008" },
      { employeeId: employees[6].employeeId, phoneNumber: "9801-100009" },
      { employeeId: employees[7].employeeId, phoneNumber: "9851-100010" },
    ],
  });

  // ── Customers ──────────────────────────────────────────────────────────────
  // Note: Ramesh Adhikari and Sita Tamang appear twice but with
  //       different DOB and branch so they are distinct people
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: "Ramesh Adhikari",
        address: "Lazimpat, Kathmandu",
        dateOfBirth: new Date("1990-03-15"),
        branchId: newRoad.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Sunita Magar",
        address: "Kupondole, Lalitpur",
        dateOfBirth: new Date("1985-07-22"),
        branchId: lalitpur.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Dipesh Rai",
        address: "Chabahil, Kathmandu",
        dateOfBirth: new Date("1992-11-08"),
        branchId: dhumbarahi.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Kamala Poudel",
        address: "Sukuldhoka, Bhaktapur",
        dateOfBirth: new Date("1988-01-30"),
        branchId: bhaktapur.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Nirajan Bajracharya",
        address: "Dhumbarahi, Kathmandu",
        dateOfBirth: new Date("1995-06-18"),
        branchId: newRoad.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Puja Lama",
        address: "Imadol, Lalitpur",
        dateOfBirth: new Date("1993-09-25"),
        branchId: baneshwor.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Sagar Pandey",
        address: "Baluwatar, Kathmandu",
        dateOfBirth: new Date("1980-12-05"),
        branchId: dhumbarahi.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Manisha Khadka",
        address: "Koteshwor, Kathmandu",
        dateOfBirth: new Date("1997-04-14"),
        branchId: bhaktapur.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Bibek Shrestha",
        address: "Naxal, Kathmandu",
        dateOfBirth: new Date("1991-08-20"),
        branchId: lalitpur.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Pooja Maharjan",
        address: "Patan, Lalitpur",
        dateOfBirth: new Date("1994-02-11"),
        branchId: lalitpur.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Aakash Tamang",
        address: "Jorpati, Kathmandu",
        dateOfBirth: new Date("1987-05-30"),
        branchId: baneshwor.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Rekha Thapa",
        address: "Bhaisepati, Lalitpur",
        dateOfBirth: new Date("1996-10-03"),
        branchId: lalitpur.branchId,
      },
    }),
    // Same first names, clearly different people (different DOB + branch)
    prisma.customer.create({
      data: {
        name: "Ramesh Adhikari",
        address: "Baneshwor, Kathmandu",
        dateOfBirth: new Date("1978-06-25"),
        branchId: baneshwor.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Sunita Magar",
        address: "Bhaktapur Sadak, Bhaktapur",
        dateOfBirth: new Date("1999-03-17"),
        branchId: bhaktapur.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Dipesh Rai",
        address: "Thamel, Kathmandu",
        dateOfBirth: new Date("2000-07-09"),
        branchId: newRoad.branchId,
      },
    }),
  ]);

  await prisma.customerPhone.createMany({
    data: [
      { customerId: customers[0].customerId, phoneNumber: "9841-200001" },
      { customerId: customers[1].customerId, phoneNumber: "9851-200002" },
      { customerId: customers[1].customerId, phoneNumber: "9801-200003" }, // two phones
      { customerId: customers[2].customerId, phoneNumber: "9841-200004" },
      { customerId: customers[3].customerId, phoneNumber: "9861-200005" },
      { customerId: customers[4].customerId, phoneNumber: "9841-200006" },
      { customerId: customers[4].customerId, phoneNumber: "9801-200007" }, // two phones
      { customerId: customers[5].customerId, phoneNumber: "9851-200008" },
      { customerId: customers[6].customerId, phoneNumber: "9841-200009" },
      { customerId: customers[7].customerId, phoneNumber: "9801-200010" },
      { customerId: customers[8].customerId, phoneNumber: "9841-200011" },
      { customerId: customers[9].customerId, phoneNumber: "9851-200012" },
      { customerId: customers[10].customerId, phoneNumber: "9861-200013" },
      { customerId: customers[11].customerId, phoneNumber: "9841-200014" },
      { customerId: customers[12].customerId, phoneNumber: "9801-200015" },
      { customerId: customers[13].customerId, phoneNumber: "9851-200016" },
      { customerId: customers[14].customerId, phoneNumber: "9841-200017" },
    ],
  });

  // ── Accounts ───────────────────────────────────────────────────────────────
  const accounts = await Promise.all([
    prisma.account.create({ data: { balance: 50000.0 } }), // acc 0  → customers[0]
    prisma.account.create({ data: { balance: 125000.0 } }), // acc 1  → customers[0] (2nd account)
    prisma.account.create({ data: { balance: 32000.0 } }), // acc 2  → customers[1]
    prisma.account.create({ data: { balance: 870000.0 } }), // acc 3  → customers[2]
    prisma.account.create({ data: { balance: 4500.0 } }), // acc 4  → customers[3]
    prisma.account.create({ data: { balance: 230000.0 } }), // acc 5  → customers[3] (2nd account)
    prisma.account.create({ data: { balance: 67500.0 } }), // acc 6  → customers[4]
    prisma.account.create({ data: { balance: 150000.0 } }), // acc 7  → customers[5]
    prisma.account.create({ data: { balance: 9000.0 } }), // acc 8  → customers[6]
    prisma.account.create({ data: { balance: 420000.0 } }), // acc 9  → customers[7]
    prisma.account.create({ data: { balance: 85000.0 } }), // acc 10 → customers[8]
    prisma.account.create({ data: { balance: 17000.0 } }), // acc 11 → customers[9]
    prisma.account.create({ data: { balance: 310000.0 } }), // acc 12 → customers[10]
    prisma.account.create({ data: { balance: 54000.0 } }), // acc 13 → customers[11]
    prisma.account.create({ data: { balance: 6500.0 } }), // acc 14 → customers[12]
    prisma.account.create({ data: { balance: 99000.0 } }), // acc 15 → customers[13]
    prisma.account.create({ data: { balance: 210000.0 } }), // acc 16 → customers[14]
  ]);

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
      { customerId: customers[8].customerId, accNo: accounts[10].accNo },
      { customerId: customers[9].customerId, accNo: accounts[11].accNo },
      { customerId: customers[10].customerId, accNo: accounts[12].accNo },
      { customerId: customers[11].customerId, accNo: accounts[13].accNo },
      { customerId: customers[12].customerId, accNo: accounts[14].accNo },
      { customerId: customers[13].customerId, accNo: accounts[15].accNo },
      { customerId: customers[14].customerId, accNo: accounts[16].accNo },
      { customerId: customers[1].customerId, accNo: accounts[9].accNo }, // shared account between 2 customers
    ],
  });

  // ── Loans ──────────────────────────────────────────────────────────────────
  const loans = await Promise.all([
    prisma.loan.create({ data: { amount: 100000.0 } }),
    prisma.loan.create({ data: { amount: 250000.0 } }),
    prisma.loan.create({ data: { amount: 50000.0 } }),
    prisma.loan.create({ data: { amount: 1500000.0 } }),
    prisma.loan.create({ data: { amount: 80000.0 } }),
    prisma.loan.create({ data: { amount: 500000.0 } }),
    prisma.loan.create({ data: { amount: 175000.0 } }),
    prisma.loan.create({ data: { amount: 320000.0 } }),
  ]);

  await prisma.customerLoan.createMany({
    data: [
      // customers with multiple loans (good for GROUP BY demo)
      { customerId: customers[0].customerId, loanId: loans[0].loanId },
      { customerId: customers[0].customerId, loanId: loans[1].loanId },
      { customerId: customers[2].customerId, loanId: loans[2].loanId },
      { customerId: customers[2].customerId, loanId: loans[3].loanId },
      { customerId: customers[2].customerId, loanId: loans[6].loanId },
      { customerId: customers[4].customerId, loanId: loans[4].loanId },
      { customerId: customers[4].customerId, loanId: loans[5].loanId },
      { customerId: customers[6].customerId, loanId: loans[7].loanId },
      { customerId: customers[8].customerId, loanId: loans[0].loanId }, // shared loan
      { customerId: customers[10].customerId, loanId: loans[2].loanId }, // shared loan
      // customers with no loan: customers[1,3,5,7,9,11,12,13,14]
      // (good for the NOT IN subquery manual query)
    ],
  });

  // ── Transactions ───────────────────────────────────────────────────────────
  // Multiple transactions per account so GROUP BY aggregations are meaningful
  await prisma.transaction.createMany({
    data: [
      // acc 0 — 4 transactions
      {
        accNo: accounts[0].accNo,
        type: TransactionType.DEPOSIT,
        amount: 20000.0,
        date: new Date("2024-01-05"),
      },
      {
        accNo: accounts[0].accNo,
        type: TransactionType.WITHDRAWAL,
        amount: 5000.0,
        date: new Date("2024-02-10"),
      },
      {
        accNo: accounts[0].accNo,
        type: TransactionType.DEPOSIT,
        amount: 15000.0,
        date: new Date("2024-03-18"),
      },
      {
        accNo: accounts[0].accNo,
        type: TransactionType.PAYMENT,
        amount: 3000.0,
        date: new Date("2024-04-02"),
      },

      // acc 1 — 4 transactions
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
        date: new Date("2024-02-20"),
      },
      {
        accNo: accounts[1].accNo,
        type: TransactionType.WITHDRAWAL,
        amount: 8000.0,
        date: new Date("2024-03-05"),
      },
      {
        accNo: accounts[1].accNo,
        type: TransactionType.DEPOSIT,
        amount: 30000.0,
        date: new Date("2024-05-11"),
      },

      // acc 2 — 3 transactions
      {
        accNo: accounts[2].accNo,
        type: TransactionType.DEPOSIT,
        amount: 10000.0,
        date: new Date("2024-01-22"),
      },
      {
        accNo: accounts[2].accNo,
        type: TransactionType.PAYMENT,
        amount: 3000.0,
        date: new Date("2024-02-14"),
      },
      {
        accNo: accounts[2].accNo,
        type: TransactionType.WITHDRAWAL,
        amount: 4000.0,
        date: new Date("2024-04-30"),
      },

      // acc 3 — 4 transactions (high-value account)
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
        date: new Date("2024-02-25"),
      },
      {
        accNo: accounts[3].accNo,
        type: TransactionType.TRANSFER,
        amount: 75000.0,
        date: new Date("2024-03-15"),
      },
      {
        accNo: accounts[3].accNo,
        type: TransactionType.DEPOSIT,
        amount: 120000.0,
        date: new Date("2024-06-01"),
      },

      // acc 4 — 2 transactions
      {
        accNo: accounts[4].accNo,
        type: TransactionType.PAYMENT,
        amount: 1500.0,
        date: new Date("2024-02-15"),
      },
      {
        accNo: accounts[4].accNo,
        type: TransactionType.DEPOSIT,
        amount: 5000.0,
        date: new Date("2024-05-20"),
      },

      // acc 5 — 3 transactions
      {
        accNo: accounts[5].accNo,
        type: TransactionType.TRANSFER,
        amount: 30000.0,
        date: new Date("2024-03-01"),
      },
      {
        accNo: accounts[5].accNo,
        type: TransactionType.DEPOSIT,
        amount: 45000.0,
        date: new Date("2024-04-10"),
      },
      {
        accNo: accounts[5].accNo,
        type: TransactionType.WITHDRAWAL,
        amount: 12000.0,
        date: new Date("2024-05-05"),
      },

      // acc 6 — 3 transactions
      {
        accNo: accounts[6].accNo,
        type: TransactionType.DEPOSIT,
        amount: 7500.0,
        date: new Date("2024-03-05"),
      },
      {
        accNo: accounts[6].accNo,
        type: TransactionType.PAYMENT,
        amount: 2000.0,
        date: new Date("2024-04-18"),
      },
      {
        accNo: accounts[6].accNo,
        type: TransactionType.DEPOSIT,
        amount: 11000.0,
        date: new Date("2024-06-22"),
      },

      // acc 7 — 3 transactions
      {
        accNo: accounts[7].accNo,
        type: TransactionType.WITHDRAWAL,
        amount: 20000.0,
        date: new Date("2024-03-10"),
      },
      {
        accNo: accounts[7].accNo,
        type: TransactionType.DEPOSIT,
        amount: 60000.0,
        date: new Date("2024-04-25"),
      },
      {
        accNo: accounts[7].accNo,
        type: TransactionType.TRANSFER,
        amount: 18000.0,
        date: new Date("2024-05-30"),
      },

      // acc 8 — 2 transactions
      {
        accNo: accounts[8].accNo,
        type: TransactionType.PAYMENT,
        amount: 5000.0,
        date: new Date("2024-03-15"),
      },
      {
        accNo: accounts[8].accNo,
        type: TransactionType.DEPOSIT,
        amount: 8000.0,
        date: new Date("2024-06-08"),
      },

      // acc 9 — 4 transactions (shared account)
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
        date: new Date("2024-03-28"),
      },
      {
        accNo: accounts[9].accNo,
        type: TransactionType.WITHDRAWAL,
        amount: 40000.0,
        date: new Date("2024-04-15"),
      },
      {
        accNo: accounts[9].accNo,
        type: TransactionType.DEPOSIT,
        amount: 55000.0,
        date: new Date("2024-07-01"),
      },

      // acc 10 — 3 transactions
      {
        accNo: accounts[10].accNo,
        type: TransactionType.DEPOSIT,
        amount: 25000.0,
        date: new Date("2024-04-03"),
      },
      {
        accNo: accounts[10].accNo,
        type: TransactionType.PAYMENT,
        amount: 7000.0,
        date: new Date("2024-05-14"),
      },
      {
        accNo: accounts[10].accNo,
        type: TransactionType.DEPOSIT,
        amount: 14000.0,
        date: new Date("2024-06-19"),
      },

      // acc 11 — 2 transactions
      {
        accNo: accounts[11].accNo,
        type: TransactionType.DEPOSIT,
        amount: 9000.0,
        date: new Date("2024-04-07"),
      },
      {
        accNo: accounts[11].accNo,
        type: TransactionType.WITHDRAWAL,
        amount: 3500.0,
        date: new Date("2024-06-30"),
      },

      // acc 12 — 3 transactions
      {
        accNo: accounts[12].accNo,
        type: TransactionType.DEPOSIT,
        amount: 80000.0,
        date: new Date("2024-05-01"),
      },
      {
        accNo: accounts[12].accNo,
        type: TransactionType.TRANSFER,
        amount: 35000.0,
        date: new Date("2024-05-22"),
      },
      {
        accNo: accounts[12].accNo,
        type: TransactionType.WITHDRAWAL,
        amount: 22000.0,
        date: new Date("2024-07-10"),
      },

      // acc 13 — 2 transactions
      {
        accNo: accounts[13].accNo,
        type: TransactionType.DEPOSIT,
        amount: 18000.0,
        date: new Date("2024-05-08"),
      },
      {
        accNo: accounts[13].accNo,
        type: TransactionType.PAYMENT,
        amount: 4500.0,
        date: new Date("2024-06-25"),
      },

      // acc 14 — 2 transactions
      {
        accNo: accounts[14].accNo,
        type: TransactionType.PAYMENT,
        amount: 2500.0,
        date: new Date("2024-05-17"),
      },
      {
        accNo: accounts[14].accNo,
        type: TransactionType.DEPOSIT,
        amount: 6000.0,
        date: new Date("2024-07-05"),
      },

      // acc 15 — 3 transactions
      {
        accNo: accounts[15].accNo,
        type: TransactionType.DEPOSIT,
        amount: 40000.0,
        date: new Date("2024-06-03"),
      },
      {
        accNo: accounts[15].accNo,
        type: TransactionType.WITHDRAWAL,
        amount: 9000.0,
        date: new Date("2024-06-18"),
      },
      {
        accNo: accounts[15].accNo,
        type: TransactionType.TRANSFER,
        amount: 16000.0,
        date: new Date("2024-07-14"),
      },

      // acc 16 — 3 transactions
      {
        accNo: accounts[16].accNo,
        type: TransactionType.DEPOSIT,
        amount: 70000.0,
        date: new Date("2024-06-10"),
      },
      {
        accNo: accounts[16].accNo,
        type: TransactionType.PAYMENT,
        amount: 12000.0,
        date: new Date("2024-07-02"),
      },
      {
        accNo: accounts[16].accNo,
        type: TransactionType.DEPOSIT,
        amount: 35000.0,
        date: new Date("2024-07-20"),
      },
    ],
  });

  console.log("✅ Seeding complete!");
  console.log(`   ${branches.length} branches`);
  console.log(`   ${employees.length} employees`);
  console.log(`   ${customers.length} customers`);
  console.log(`   ${accounts.length} accounts`);
  console.log(`   ${loans.length} loans`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
