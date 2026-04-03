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

  // ── Branches (12) ──────────────────────────────────────────────────────────
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
    prisma.branch.create({
      data: { name: "Thamel Branch", address: "Thamel, Kathmandu" },
    }),
    prisma.branch.create({
      data: { name: "Patan Branch", address: "Mangalbazar, Patan" },
    }),
    prisma.branch.create({
      data: { name: "Jorpati Branch", address: "Jorpati, Kathmandu" },
    }),
    prisma.branch.create({
      data: { name: "Koteshwor Branch", address: "Koteshwor, Kathmandu" },
    }),
    prisma.branch.create({
      data: { name: "Balaju Branch", address: "Balaju, Kathmandu" },
    }),
    prisma.branch.create({
      data: { name: "Kirtipur Branch", address: "Kirtipur, Kathmandu" },
    }),
    prisma.branch.create({
      data: { name: "Boudha Branch", address: "Boudha, Kathmandu" },
    }),
  ]);

  const [
    newRoad,
    lalitpur,
    dhumbarahi,
    bhaktapur,
    baneshwor,
    thamel,
    patan,
    jorpati,
    koteshwor,
    balaju,
    kirtipur,
    boudha,
  ] = branches;

  // ── Employees (2-3 per branch, 28 total) ───────────────────────────────────
  const employees = await Promise.all([
    // New Road
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
        name: "Mohan Adhikari",
        address: "Lazimpat, Kathmandu",
        salary: 48000,
        branchId: newRoad.branchId,
      },
    }),
    // Lalitpur
    prisma.employee.create({
      data: {
        name: "Bikash Maharjan",
        address: "Pulchowk, Lalitpur",
        salary: 51000,
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
    // Dhumbarahi
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
        name: "Nisha Pandey",
        address: "Baneshwor, Kathmandu",
        salary: 44000,
        branchId: dhumbarahi.branchId,
      },
    }),
    // Bhaktapur
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
        name: "Ramesh Khadka",
        address: "Sukuldhoka, Bhaktapur",
        salary: 58000,
        branchId: bhaktapur.branchId,
      },
    }),
    // Baneshwor
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
        name: "Kabita Rai",
        address: "Baneshwor, Kathmandu",
        salary: 46000,
        branchId: baneshwor.branchId,
      },
    }),
    // Thamel
    prisma.employee.create({
      data: {
        name: "Santosh Lama",
        address: "Thamel, Kathmandu",
        salary: 60000,
        branchId: thamel.branchId,
      },
    }),
    prisma.employee.create({
      data: {
        name: "Deepa Bajracharya",
        address: "Naxal, Kathmandu",
        salary: 54000,
        branchId: thamel.branchId,
      },
    }),
    // Patan
    prisma.employee.create({
      data: {
        name: "Ujjwal Magar",
        address: "Patan, Lalitpur",
        salary: 57000,
        branchId: patan.branchId,
      },
    }),
    prisma.employee.create({
      data: {
        name: "Samjhana Poudel",
        address: "Kupondole, Lalitpur",
        salary: 43000,
        branchId: patan.branchId,
      },
    }),
    // Jorpati
    prisma.employee.create({
      data: {
        name: "Nabin Shrestha",
        address: "Jorpati, Kathmandu",
        salary: 50000,
        branchId: jorpati.branchId,
      },
    }),
    prisma.employee.create({
      data: {
        name: "Srijana Tamang",
        address: "Chabahil, Kathmandu",
        salary: 47000,
        branchId: jorpati.branchId,
      },
    }),
    // Koteshwor
    prisma.employee.create({
      data: {
        name: "Prakash Oli",
        address: "Koteshwor, Kathmandu",
        salary: 65000,
        branchId: koteshwor.branchId,
      },
    }),
    prisma.employee.create({
      data: {
        name: "Menuka Thapa",
        address: "Tinkune, Kathmandu",
        salary: 48000,
        branchId: koteshwor.branchId,
      },
    }),
    // Balaju
    prisma.employee.create({
      data: {
        name: "Binod Koirala",
        address: "Balaju, Kathmandu",
        salary: 52000,
        branchId: balaju.branchId,
      },
    }),
    prisma.employee.create({
      data: {
        name: "Sarita Gurung",
        address: "Machhapokhari, Kathmandu",
        salary: 45000,
        branchId: balaju.branchId,
      },
    }),
    // Kirtipur
    prisma.employee.create({
      data: {
        name: "Dipak Neupane",
        address: "Kirtipur, Kathmandu",
        salary: 56000,
        branchId: kirtipur.branchId,
      },
    }),
    prisma.employee.create({
      data: {
        name: "Pramila Shrestha",
        address: "Naikap, Kathmandu",
        salary: 41000,
        branchId: kirtipur.branchId,
      },
    }),
    // Boudha
    prisma.employee.create({
      data: {
        name: "Tenzin Lama",
        address: "Boudha, Kathmandu",
        salary: 59000,
        branchId: boudha.branchId,
      },
    }),
    prisma.employee.create({
      data: {
        name: "Karma Sherpa",
        address: "Kapan, Kathmandu",
        salary: 63000,
        branchId: boudha.branchId,
      },
    }),
  ]);

  await prisma.employeePhone.createMany({
    data: [
      { employeeId: employees[0].employeeId, phoneNumber: "9841-100001" },
      { employeeId: employees[1].employeeId, phoneNumber: "9841-100002" },
      { employeeId: employees[1].employeeId, phoneNumber: "9801-100003" },
      { employeeId: employees[2].employeeId, phoneNumber: "9851-100004" },
      { employeeId: employees[3].employeeId, phoneNumber: "9841-100005" },
      { employeeId: employees[4].employeeId, phoneNumber: "9801-100006" },
      { employeeId: employees[4].employeeId, phoneNumber: "9861-100007" },
      { employeeId: employees[5].employeeId, phoneNumber: "9841-100008" },
      { employeeId: employees[6].employeeId, phoneNumber: "9851-100009" },
      { employeeId: employees[7].employeeId, phoneNumber: "9841-100010" },
      { employeeId: employees[8].employeeId, phoneNumber: "9801-100011" },
      { employeeId: employees[9].employeeId, phoneNumber: "9861-100012" },
      { employeeId: employees[10].employeeId, phoneNumber: "9841-100013" },
      { employeeId: employees[11].employeeId, phoneNumber: "9851-100014" },
      { employeeId: employees[12].employeeId, phoneNumber: "9841-100015" },
      { employeeId: employees[13].employeeId, phoneNumber: "9801-100016" },
      { employeeId: employees[14].employeeId, phoneNumber: "9841-100017" },
      { employeeId: employees[15].employeeId, phoneNumber: "9851-100018" },
      { employeeId: employees[16].employeeId, phoneNumber: "9841-100019" },
      { employeeId: employees[17].employeeId, phoneNumber: "9801-100020" },
      { employeeId: employees[18].employeeId, phoneNumber: "9841-100021" },
      { employeeId: employees[19].employeeId, phoneNumber: "9851-100022" },
      { employeeId: employees[20].employeeId, phoneNumber: "9841-100023" },
      { employeeId: employees[21].employeeId, phoneNumber: "9801-100024" },
      { employeeId: employees[22].employeeId, phoneNumber: "9841-100025" },
      { employeeId: employees[23].employeeId, phoneNumber: "9851-100026" },
      { employeeId: employees[24].employeeId, phoneNumber: "9841-100027" },
      { employeeId: employees[24].employeeId, phoneNumber: "9801-100028" },
    ],
  });

  // ── Customers (52 total, 4 duplicate-name pairs) ───────────────────────────
  const customers = await Promise.all([
    // 0
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
    // 5
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
        branchId: thamel.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Pooja Maharjan",
        address: "Patan, Lalitpur",
        dateOfBirth: new Date("1994-02-11"),
        branchId: patan.branchId,
      },
    }),
    // 10
    prisma.customer.create({
      data: {
        name: "Aakash Tamang",
        address: "Jorpati, Kathmandu",
        dateOfBirth: new Date("1987-05-30"),
        branchId: jorpati.branchId,
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
    prisma.customer.create({
      data: {
        name: "Sandip Koirala",
        address: "Baneshwor, Kathmandu",
        dateOfBirth: new Date("1983-03-27"),
        branchId: koteshwor.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Anusha Gurung",
        address: "Machhapokhari, Kathmandu",
        dateOfBirth: new Date("1998-12-19"),
        branchId: balaju.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Prakash Neupane",
        address: "Kirtipur, Kathmandu",
        dateOfBirth: new Date("1986-07-08"),
        branchId: kirtipur.branchId,
      },
    }),
    // 15
    prisma.customer.create({
      data: {
        name: "Sabina Shrestha",
        address: "Boudha, Kathmandu",
        dateOfBirth: new Date("1999-01-23"),
        branchId: boudha.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Nabin Basnet",
        address: "Kapan, Kathmandu",
        dateOfBirth: new Date("1989-09-14"),
        branchId: boudha.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Kritika Rai",
        address: "Tinkune, Kathmandu",
        dateOfBirth: new Date("1994-06-05"),
        branchId: koteshwor.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Suresh Tamang",
        address: "Balaju, Kathmandu",
        dateOfBirth: new Date("1982-11-17"),
        branchId: balaju.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Alina Bajracharya",
        address: "Naikap, Kathmandu",
        dateOfBirth: new Date("2000-04-29"),
        branchId: kirtipur.branchId,
      },
    }),
    // 20
    prisma.customer.create({
      data: {
        name: "Hemant Shrestha",
        address: "Thamel, Kathmandu",
        dateOfBirth: new Date("1979-08-11"),
        branchId: thamel.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Binita Magar",
        address: "Pulchowk, Lalitpur",
        dateOfBirth: new Date("1996-03-02"),
        branchId: patan.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Rajan Karki",
        address: "Chabahil, Kathmandu",
        dateOfBirth: new Date("1984-10-21"),
        branchId: jorpati.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Priyanka Lama",
        address: "Gwarko, Lalitpur",
        dateOfBirth: new Date("1997-07-16"),
        branchId: lalitpur.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Ashok Pandey",
        address: "Lazimpat, Kathmandu",
        dateOfBirth: new Date("1981-02-28"),
        branchId: newRoad.branchId,
      },
    }),
    // 25
    prisma.customer.create({
      data: {
        name: "Mina Gurung",
        address: "Bhaisepati, Lalitpur",
        dateOfBirth: new Date("1993-05-09"),
        branchId: patan.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Bishal Maharjan",
        address: "Patan, Lalitpur",
        dateOfBirth: new Date("1990-12-31"),
        branchId: patan.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Shristi Thapa",
        address: "Koteshwor, Kathmandu",
        dateOfBirth: new Date("1998-08-07"),
        branchId: koteshwor.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Lokesh Koirala",
        address: "Balaju, Kathmandu",
        dateOfBirth: new Date("1985-04-18"),
        branchId: balaju.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Sweta Shrestha",
        address: "Boudha, Kathmandu",
        dateOfBirth: new Date("1995-11-25"),
        branchId: boudha.branchId,
      },
    }),
    // 30
    prisma.customer.create({
      data: {
        name: "Gaurav Basnet",
        address: "Jorpati, Kathmandu",
        dateOfBirth: new Date("1988-06-13"),
        branchId: jorpati.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Sushma Rai",
        address: "Kapan, Kathmandu",
        dateOfBirth: new Date("1992-01-04"),
        branchId: boudha.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Anil Neupane",
        address: "Kirtipur, Kathmandu",
        dateOfBirth: new Date("1986-09-22"),
        branchId: kirtipur.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Rojina Tamang",
        address: "Thamel, Kathmandu",
        dateOfBirth: new Date("1999-03-10"),
        branchId: thamel.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Kiran Bajracharya",
        address: "Dhumbarahi, Kathmandu",
        dateOfBirth: new Date("1983-07-29"),
        branchId: dhumbarahi.branchId,
      },
    }),
    // 35
    prisma.customer.create({
      data: {
        name: "Pratima Pandey",
        address: "Baneshwor, Kathmandu",
        dateOfBirth: new Date("1994-10-16"),
        branchId: baneshwor.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Sunil Shrestha",
        address: "Naxal, Kathmandu",
        dateOfBirth: new Date("1980-05-07"),
        branchId: newRoad.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Jyoti Gurung",
        address: "Imadol, Lalitpur",
        dateOfBirth: new Date("1997-02-19"),
        branchId: lalitpur.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Bikram Karki",
        address: "Baluwatar, Kathmandu",
        dateOfBirth: new Date("1991-11-03"),
        branchId: baneshwor.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Sarita Lama",
        address: "Machhapokhari, Kathmandu",
        dateOfBirth: new Date("1987-08-24"),
        branchId: balaju.branchId,
      },
    }),
    // 40
    prisma.customer.create({
      data: {
        name: "Dinesh Maharjan",
        address: "Patan, Lalitpur",
        dateOfBirth: new Date("1995-04-06"),
        branchId: patan.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Usha Magar",
        address: "Sukuldhoka, Bhaktapur",
        dateOfBirth: new Date("1989-12-14"),
        branchId: bhaktapur.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Rabin Thapa",
        address: "Chabahil, Kathmandu",
        dateOfBirth: new Date("1993-06-30"),
        branchId: dhumbarahi.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Kopila Koirala",
        address: "Tinkune, Kathmandu",
        dateOfBirth: new Date("1996-09-11"),
        branchId: koteshwor.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Mandip Basnet",
        address: "Jorpati, Kathmandu",
        dateOfBirth: new Date("1984-03-05"),
        branchId: jorpati.branchId,
      },
    }),
    // 45
    prisma.customer.create({
      data: {
        name: "Nirmala Shrestha",
        address: "Boudha, Kathmandu",
        dateOfBirth: new Date("1998-07-21"),
        branchId: boudha.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Bijay Rai",
        address: "Kirtipur, Kathmandu",
        dateOfBirth: new Date("1982-10-08"),
        branchId: kirtipur.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Anisha Tamang",
        address: "Kapan, Kathmandu",
        dateOfBirth: new Date("2001-01-17"),
        branchId: boudha.branchId,
      },
    }),
    // Duplicate names — clearly different people (different DOB + branch)
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
        dateOfBirth: new Date("1975-03-17"),
        branchId: bhaktapur.branchId,
      },
    }),
    // 50
    prisma.customer.create({
      data: {
        name: "Dipesh Rai",
        address: "Thamel, Kathmandu",
        dateOfBirth: new Date("2000-07-09"),
        branchId: thamel.branchId,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Manisha Khadka",
        address: "Gwarko, Lalitpur",
        dateOfBirth: new Date("1976-11-30"),
        branchId: patan.branchId,
      },
    }),
  ]);

  await prisma.customerPhone.createMany({
    data: [
      { customerId: customers[0].customerId, phoneNumber: "9841-200001" },
      { customerId: customers[1].customerId, phoneNumber: "9851-200002" },
      { customerId: customers[1].customerId, phoneNumber: "9801-200003" },
      { customerId: customers[2].customerId, phoneNumber: "9841-200004" },
      { customerId: customers[3].customerId, phoneNumber: "9861-200005" },
      { customerId: customers[4].customerId, phoneNumber: "9841-200006" },
      { customerId: customers[4].customerId, phoneNumber: "9801-200007" },
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
      { customerId: customers[15].customerId, phoneNumber: "9801-200018" },
      { customerId: customers[16].customerId, phoneNumber: "9851-200019" },
      { customerId: customers[17].customerId, phoneNumber: "9841-200020" },
      { customerId: customers[18].customerId, phoneNumber: "9801-200021" },
      { customerId: customers[19].customerId, phoneNumber: "9851-200022" },
      { customerId: customers[20].customerId, phoneNumber: "9841-200023" },
      { customerId: customers[21].customerId, phoneNumber: "9861-200024" },
      { customerId: customers[22].customerId, phoneNumber: "9841-200025" },
      { customerId: customers[23].customerId, phoneNumber: "9801-200026" },
      { customerId: customers[24].customerId, phoneNumber: "9851-200027" },
      { customerId: customers[25].customerId, phoneNumber: "9841-200028" },
      { customerId: customers[26].customerId, phoneNumber: "9801-200029" },
      { customerId: customers[27].customerId, phoneNumber: "9841-200030" },
      { customerId: customers[28].customerId, phoneNumber: "9851-200031" },
      { customerId: customers[29].customerId, phoneNumber: "9841-200032" },
      { customerId: customers[30].customerId, phoneNumber: "9801-200033" },
      { customerId: customers[31].customerId, phoneNumber: "9851-200034" },
      { customerId: customers[32].customerId, phoneNumber: "9841-200035" },
      { customerId: customers[33].customerId, phoneNumber: "9861-200036" },
      { customerId: customers[34].customerId, phoneNumber: "9841-200037" },
      { customerId: customers[35].customerId, phoneNumber: "9801-200038" },
      { customerId: customers[36].customerId, phoneNumber: "9851-200039" },
      { customerId: customers[37].customerId, phoneNumber: "9841-200040" },
      { customerId: customers[38].customerId, phoneNumber: "9801-200041" },
      { customerId: customers[39].customerId, phoneNumber: "9851-200042" },
      { customerId: customers[40].customerId, phoneNumber: "9841-200043" },
      { customerId: customers[41].customerId, phoneNumber: "9801-200044" },
      { customerId: customers[42].customerId, phoneNumber: "9841-200045" },
      { customerId: customers[43].customerId, phoneNumber: "9851-200046" },
      { customerId: customers[44].customerId, phoneNumber: "9841-200047" },
      { customerId: customers[45].customerId, phoneNumber: "9801-200048" },
      { customerId: customers[46].customerId, phoneNumber: "9851-200049" },
      { customerId: customers[47].customerId, phoneNumber: "9841-200050" },
      { customerId: customers[48].customerId, phoneNumber: "9801-200051" },
      { customerId: customers[49].customerId, phoneNumber: "9851-200052" },
      { customerId: customers[50].customerId, phoneNumber: "9841-200053" },
      { customerId: customers[51].customerId, phoneNumber: "9801-200054" },
    ],
  });

  // ── Accounts (one per customer, a few customers get 2) ─────────────────────
  const accounts = await Promise.all([
    prisma.account.create({ data: { balance: 50000.0 } }), // 0
    prisma.account.create({ data: { balance: 125000.0 } }), // 1  — extra for customers[0]
    prisma.account.create({ data: { balance: 32000.0 } }), // 2
    prisma.account.create({ data: { balance: 870000.0 } }), // 3
    prisma.account.create({ data: { balance: 4500.0 } }), // 4
    prisma.account.create({ data: { balance: 230000.0 } }), // 5  — extra for customers[3]
    prisma.account.create({ data: { balance: 67500.0 } }), // 6
    prisma.account.create({ data: { balance: 150000.0 } }), // 7
    prisma.account.create({ data: { balance: 9000.0 } }), // 8
    prisma.account.create({ data: { balance: 420000.0 } }), // 9
    prisma.account.create({ data: { balance: 85000.0 } }), // 10
    prisma.account.create({ data: { balance: 17000.0 } }), // 11
    prisma.account.create({ data: { balance: 310000.0 } }), // 12
    prisma.account.create({ data: { balance: 54000.0 } }), // 13
    prisma.account.create({ data: { balance: 6500.0 } }), // 14
    prisma.account.create({ data: { balance: 99000.0 } }), // 15
    prisma.account.create({ data: { balance: 210000.0 } }), // 16
    prisma.account.create({ data: { balance: 38000.0 } }), // 17
    prisma.account.create({ data: { balance: 730000.0 } }), // 18
    prisma.account.create({ data: { balance: 15500.0 } }), // 19
    prisma.account.create({ data: { balance: 480000.0 } }), // 20
    prisma.account.create({ data: { balance: 27000.0 } }), // 21
    prisma.account.create({ data: { balance: 93000.0 } }), // 22
    prisma.account.create({ data: { balance: 560000.0 } }), // 23
    prisma.account.create({ data: { balance: 11000.0 } }), // 24
    prisma.account.create({ data: { balance: 145000.0 } }), // 25
    prisma.account.create({ data: { balance: 72000.0 } }), // 26
    prisma.account.create({ data: { balance: 390000.0 } }), // 27
    prisma.account.create({ data: { balance: 8500.0 } }), // 28
    prisma.account.create({ data: { balance: 190000.0 } }), // 29
    prisma.account.create({ data: { balance: 44000.0 } }), // 30
    prisma.account.create({ data: { balance: 625000.0 } }), // 31
    prisma.account.create({ data: { balance: 22000.0 } }), // 32
    prisma.account.create({ data: { balance: 108000.0 } }), // 33
    prisma.account.create({ data: { balance: 59000.0 } }), // 34
    prisma.account.create({ data: { balance: 275000.0 } }), // 35
    prisma.account.create({ data: { balance: 33000.0 } }), // 36
    prisma.account.create({ data: { balance: 810000.0 } }), // 37
    prisma.account.create({ data: { balance: 16000.0 } }), // 38
    prisma.account.create({ data: { balance: 450000.0 } }), // 39
    prisma.account.create({ data: { balance: 71000.0 } }), // 40
    prisma.account.create({ data: { balance: 130000.0 } }), // 41
    prisma.account.create({ data: { balance: 5500.0 } }), // 42
    prisma.account.create({ data: { balance: 340000.0 } }), // 43
    prisma.account.create({ data: { balance: 48000.0 } }), // 44
    prisma.account.create({ data: { balance: 920000.0 } }), // 45
    prisma.account.create({ data: { balance: 13000.0 } }), // 46
    prisma.account.create({ data: { balance: 255000.0 } }), // 47
    prisma.account.create({ data: { balance: 61000.0 } }), // 48
    prisma.account.create({ data: { balance: 175000.0 } }), // 49
    prisma.account.create({ data: { balance: 29000.0 } }), // 50
    prisma.account.create({ data: { balance: 495000.0 } }), // 51
    prisma.account.create({ data: { balance: 37000.0 } }), // 52 — extra for customers[10]
    prisma.account.create({ data: { balance: 680000.0 } }), // 53 — extra for customers[20]
  ]);

  await prisma.customerAccount.createMany({
    data: [
      { customerId: customers[0].customerId, accNo: accounts[0].accNo },
      { customerId: customers[0].customerId, accNo: accounts[1].accNo }, // 2 accounts
      { customerId: customers[1].customerId, accNo: accounts[2].accNo },
      { customerId: customers[2].customerId, accNo: accounts[3].accNo },
      { customerId: customers[3].customerId, accNo: accounts[4].accNo },
      { customerId: customers[3].customerId, accNo: accounts[5].accNo }, // 2 accounts
      { customerId: customers[4].customerId, accNo: accounts[6].accNo },
      { customerId: customers[5].customerId, accNo: accounts[7].accNo },
      { customerId: customers[6].customerId, accNo: accounts[8].accNo },
      { customerId: customers[7].customerId, accNo: accounts[9].accNo },
      { customerId: customers[8].customerId, accNo: accounts[10].accNo },
      { customerId: customers[9].customerId, accNo: accounts[11].accNo },
      { customerId: customers[10].customerId, accNo: accounts[12].accNo },
      { customerId: customers[10].customerId, accNo: accounts[52].accNo }, // 2 accounts
      { customerId: customers[11].customerId, accNo: accounts[13].accNo },
      { customerId: customers[12].customerId, accNo: accounts[14].accNo },
      { customerId: customers[13].customerId, accNo: accounts[15].accNo },
      { customerId: customers[14].customerId, accNo: accounts[16].accNo },
      { customerId: customers[15].customerId, accNo: accounts[17].accNo },
      { customerId: customers[16].customerId, accNo: accounts[18].accNo },
      { customerId: customers[17].customerId, accNo: accounts[19].accNo },
      { customerId: customers[18].customerId, accNo: accounts[20].accNo },
      { customerId: customers[19].customerId, accNo: accounts[21].accNo },
      { customerId: customers[20].customerId, accNo: accounts[22].accNo },
      { customerId: customers[20].customerId, accNo: accounts[53].accNo }, // 2 accounts
      { customerId: customers[21].customerId, accNo: accounts[23].accNo },
      { customerId: customers[22].customerId, accNo: accounts[24].accNo },
      { customerId: customers[23].customerId, accNo: accounts[25].accNo },
      { customerId: customers[24].customerId, accNo: accounts[26].accNo },
      { customerId: customers[25].customerId, accNo: accounts[27].accNo },
      { customerId: customers[26].customerId, accNo: accounts[28].accNo },
      { customerId: customers[27].customerId, accNo: accounts[29].accNo },
      { customerId: customers[28].customerId, accNo: accounts[30].accNo },
      { customerId: customers[29].customerId, accNo: accounts[31].accNo },
      { customerId: customers[30].customerId, accNo: accounts[32].accNo },
      { customerId: customers[31].customerId, accNo: accounts[33].accNo },
      { customerId: customers[32].customerId, accNo: accounts[34].accNo },
      { customerId: customers[33].customerId, accNo: accounts[35].accNo },
      { customerId: customers[34].customerId, accNo: accounts[36].accNo },
      { customerId: customers[35].customerId, accNo: accounts[37].accNo },
      { customerId: customers[36].customerId, accNo: accounts[38].accNo },
      { customerId: customers[37].customerId, accNo: accounts[39].accNo },
      { customerId: customers[38].customerId, accNo: accounts[40].accNo },
      { customerId: customers[39].customerId, accNo: accounts[41].accNo },
      { customerId: customers[40].customerId, accNo: accounts[42].accNo },
      { customerId: customers[41].customerId, accNo: accounts[43].accNo },
      { customerId: customers[42].customerId, accNo: accounts[44].accNo },
      { customerId: customers[43].customerId, accNo: accounts[45].accNo },
      { customerId: customers[44].customerId, accNo: accounts[46].accNo },
      { customerId: customers[45].customerId, accNo: accounts[47].accNo },
      { customerId: customers[46].customerId, accNo: accounts[48].accNo },
      { customerId: customers[47].customerId, accNo: accounts[49].accNo },
      { customerId: customers[48].customerId, accNo: accounts[50].accNo },
      { customerId: customers[49].customerId, accNo: accounts[51].accNo },
      { customerId: customers[50].customerId, accNo: accounts[0].accNo }, // shared account
      { customerId: customers[51].customerId, accNo: accounts[9].accNo }, // shared account
    ],
  });

  // ── Loans ──────────────────────────────────────────────────────────────────
  const loans = await Promise.all([
    prisma.loan.create({ data: { amount: 100000.0 } }), // 0
    prisma.loan.create({ data: { amount: 250000.0 } }), // 1
    prisma.loan.create({ data: { amount: 50000.0 } }), // 2
    prisma.loan.create({ data: { amount: 1500000.0 } }), // 3
    prisma.loan.create({ data: { amount: 80000.0 } }), // 4
    prisma.loan.create({ data: { amount: 500000.0 } }), // 5
    prisma.loan.create({ data: { amount: 175000.0 } }), // 6
    prisma.loan.create({ data: { amount: 320000.0 } }), // 7
    prisma.loan.create({ data: { amount: 750000.0 } }), // 8
    prisma.loan.create({ data: { amount: 60000.0 } }), // 9
    prisma.loan.create({ data: { amount: 425000.0 } }), // 10
    prisma.loan.create({ data: { amount: 90000.0 } }), // 11
    prisma.loan.create({ data: { amount: 1200000.0 } }), // 12
    prisma.loan.create({ data: { amount: 35000.0 } }), // 13
    prisma.loan.create({ data: { amount: 680000.0 } }), // 14
  ]);

  await prisma.customerLoan.createMany({
    data: [
      // customers with multiple loans (GROUP BY demo)
      { customerId: customers[0].customerId, loanId: loans[0].loanId },
      { customerId: customers[0].customerId, loanId: loans[1].loanId },
      { customerId: customers[0].customerId, loanId: loans[6].loanId },
      { customerId: customers[2].customerId, loanId: loans[2].loanId },
      { customerId: customers[2].customerId, loanId: loans[3].loanId },
      { customerId: customers[2].customerId, loanId: loans[8].loanId },
      { customerId: customers[4].customerId, loanId: loans[4].loanId },
      { customerId: customers[4].customerId, loanId: loans[5].loanId },
      { customerId: customers[6].customerId, loanId: loans[7].loanId },
      { customerId: customers[6].customerId, loanId: loans[9].loanId },
      { customerId: customers[8].customerId, loanId: loans[10].loanId },
      { customerId: customers[10].customerId, loanId: loans[11].loanId },
      { customerId: customers[10].customerId, loanId: loans[12].loanId },
      { customerId: customers[12].customerId, loanId: loans[13].loanId },
      { customerId: customers[14].customerId, loanId: loans[14].loanId },
      { customerId: customers[16].customerId, loanId: loans[0].loanId }, // shared loan
      { customerId: customers[20].customerId, loanId: loans[2].loanId }, // shared loan
      { customerId: customers[24].customerId, loanId: loans[5].loanId },
      { customerId: customers[28].customerId, loanId: loans[7].loanId },
      { customerId: customers[32].customerId, loanId: loans[9].loanId },
      // remaining ~30 customers have no loan (good for NOT IN subquery)
    ],
  });

  // ── Transactions ───────────────────────────────────────────────────────────
  await prisma.transaction.createMany({
    data: [
      // acc 0 — 4 tx
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
      // acc 1 — 4 tx
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
      // acc 2 — 3 tx
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
      // acc 3 — 4 tx (high-value)
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
      // acc 4 — 3 tx
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
      {
        accNo: accounts[4].accNo,
        type: TransactionType.WITHDRAWAL,
        amount: 2000.0,
        date: new Date("2024-06-14"),
      },
      // acc 5 — 3 tx
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
      // acc 6 — 3 tx
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
      // acc 7 — 3 tx
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
      // acc 8 — 3 tx
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
      {
        accNo: accounts[8].accNo,
        type: TransactionType.TRANSFER,
        amount: 3500.0,
        date: new Date("2024-07-01"),
      },
      // acc 9 — 4 tx (shared account)
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
      // acc 10 — 3 tx
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
      // acc 11 — 2 tx
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
      // acc 12 — 3 tx
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
      // acc 13 — 2 tx
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
      // acc 14 — 2 tx
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
      // acc 15 — 3 tx
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
      // acc 16 — 3 tx
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
      // acc 17 — 2 tx
      {
        accNo: accounts[17].accNo,
        type: TransactionType.DEPOSIT,
        amount: 22000.0,
        date: new Date("2024-04-11"),
      },
      {
        accNo: accounts[17].accNo,
        type: TransactionType.WITHDRAWAL,
        amount: 6000.0,
        date: new Date("2024-06-05"),
      },
      // acc 18 — 3 tx
      {
        accNo: accounts[18].accNo,
        type: TransactionType.DEPOSIT,
        amount: 300000.0,
        date: new Date("2024-03-08"),
      },
      {
        accNo: accounts[18].accNo,
        type: TransactionType.TRANSFER,
        amount: 90000.0,
        date: new Date("2024-04-20"),
      },
      {
        accNo: accounts[18].accNo,
        type: TransactionType.WITHDRAWAL,
        amount: 45000.0,
        date: new Date("2024-06-15"),
      },
      // acc 19 — 2 tx
      {
        accNo: accounts[19].accNo,
        type: TransactionType.DEPOSIT,
        amount: 12000.0,
        date: new Date("2024-05-03"),
      },
      {
        accNo: accounts[19].accNo,
        type: TransactionType.PAYMENT,
        amount: 3500.0,
        date: new Date("2024-07-08"),
      },
      // acc 20 — 3 tx
      {
        accNo: accounts[20].accNo,
        type: TransactionType.DEPOSIT,
        amount: 150000.0,
        date: new Date("2024-02-18"),
      },
      {
        accNo: accounts[20].accNo,
        type: TransactionType.WITHDRAWAL,
        amount: 30000.0,
        date: new Date("2024-04-22"),
      },
      {
        accNo: accounts[20].accNo,
        type: TransactionType.TRANSFER,
        amount: 55000.0,
        date: new Date("2024-06-28"),
      },
      // acc 21 — 2 tx
      {
        accNo: accounts[21].accNo,
        type: TransactionType.DEPOSIT,
        amount: 8000.0,
        date: new Date("2024-03-25"),
      },
      {
        accNo: accounts[21].accNo,
        type: TransactionType.PAYMENT,
        amount: 2000.0,
        date: new Date("2024-05-29"),
      },
      // acc 22 — 3 tx
      {
        accNo: accounts[22].accNo,
        type: TransactionType.DEPOSIT,
        amount: 35000.0,
        date: new Date("2024-04-14"),
      },
      {
        accNo: accounts[22].accNo,
        type: TransactionType.TRANSFER,
        amount: 12000.0,
        date: new Date("2024-05-19"),
      },
      {
        accNo: accounts[22].accNo,
        type: TransactionType.DEPOSIT,
        amount: 20000.0,
        date: new Date("2024-07-03"),
      },
      // acc 23 — 3 tx
      {
        accNo: accounts[23].accNo,
        type: TransactionType.DEPOSIT,
        amount: 180000.0,
        date: new Date("2024-01-30"),
      },
      {
        accNo: accounts[23].accNo,
        type: TransactionType.WITHDRAWAL,
        amount: 60000.0,
        date: new Date("2024-03-12"),
      },
      {
        accNo: accounts[23].accNo,
        type: TransactionType.TRANSFER,
        amount: 40000.0,
        date: new Date("2024-05-25"),
      },
      // acc 24 — 2 tx
      {
        accNo: accounts[24].accNo,
        type: TransactionType.DEPOSIT,
        amount: 7000.0,
        date: new Date("2024-06-07"),
      },
      {
        accNo: accounts[24].accNo,
        type: TransactionType.PAYMENT,
        amount: 1800.0,
        date: new Date("2024-07-11"),
      },
      // acc 25 — 2 tx
      {
        accNo: accounts[25].accNo,
        type: TransactionType.DEPOSIT,
        amount: 55000.0,
        date: new Date("2024-04-16"),
      },
      {
        accNo: accounts[25].accNo,
        type: TransactionType.WITHDRAWAL,
        amount: 18000.0,
        date: new Date("2024-06-21"),
      },
      // acc 26 — 2 tx
      {
        accNo: accounts[26].accNo,
        type: TransactionType.DEPOSIT,
        amount: 28000.0,
        date: new Date("2024-03-29"),
      },
      {
        accNo: accounts[26].accNo,
        type: TransactionType.TRANSFER,
        amount: 9000.0,
        date: new Date("2024-05-16"),
      },
      // acc 27 — 3 tx
      {
        accNo: accounts[27].accNo,
        type: TransactionType.DEPOSIT,
        amount: 120000.0,
        date: new Date("2024-02-08"),
      },
      {
        accNo: accounts[27].accNo,
        type: TransactionType.WITHDRAWAL,
        amount: 25000.0,
        date: new Date("2024-04-05"),
      },
      {
        accNo: accounts[27].accNo,
        type: TransactionType.PAYMENT,
        amount: 8000.0,
        date: new Date("2024-06-17"),
      },
      // acc 28 — 2 tx
      {
        accNo: accounts[28].accNo,
        type: TransactionType.DEPOSIT,
        amount: 5000.0,
        date: new Date("2024-05-10"),
      },
      {
        accNo: accounts[28].accNo,
        type: TransactionType.PAYMENT,
        amount: 1200.0,
        date: new Date("2024-07-15"),
      },
      // acc 29 — 2 tx
      {
        accNo: accounts[29].accNo,
        type: TransactionType.DEPOSIT,
        amount: 65000.0,
        date: new Date("2024-03-22"),
      },
      {
        accNo: accounts[29].accNo,
        type: TransactionType.TRANSFER,
        amount: 22000.0,
        date: new Date("2024-05-07"),
      },
      // remaining accounts get 1-2 transactions each
      {
        accNo: accounts[30].accNo,
        type: TransactionType.DEPOSIT,
        amount: 16000.0,
        date: new Date("2024-04-09"),
      },
      {
        accNo: accounts[30].accNo,
        type: TransactionType.WITHDRAWAL,
        amount: 4000.0,
        date: new Date("2024-06-23"),
      },
      {
        accNo: accounts[31].accNo,
        type: TransactionType.DEPOSIT,
        amount: 250000.0,
        date: new Date("2024-02-28"),
      },
      {
        accNo: accounts[31].accNo,
        type: TransactionType.TRANSFER,
        amount: 80000.0,
        date: new Date("2024-04-30"),
      },
      {
        accNo: accounts[32].accNo,
        type: TransactionType.DEPOSIT,
        amount: 11000.0,
        date: new Date("2024-05-23"),
      },
      {
        accNo: accounts[32].accNo,
        type: TransactionType.PAYMENT,
        amount: 3000.0,
        date: new Date("2024-07-06"),
      },
      {
        accNo: accounts[33].accNo,
        type: TransactionType.DEPOSIT,
        amount: 42000.0,
        date: new Date("2024-03-17"),
      },
      {
        accNo: accounts[33].accNo,
        type: TransactionType.WITHDRAWAL,
        amount: 11000.0,
        date: new Date("2024-05-28"),
      },
      {
        accNo: accounts[34].accNo,
        type: TransactionType.DEPOSIT,
        amount: 23000.0,
        date: new Date("2024-04-26"),
      },
      {
        accNo: accounts[34].accNo,
        type: TransactionType.TRANSFER,
        amount: 7500.0,
        date: new Date("2024-06-12"),
      },
      {
        accNo: accounts[35].accNo,
        type: TransactionType.DEPOSIT,
        amount: 95000.0,
        date: new Date("2024-02-14"),
      },
      {
        accNo: accounts[35].accNo,
        type: TransactionType.WITHDRAWAL,
        amount: 32000.0,
        date: new Date("2024-05-01"),
      },
      {
        accNo: accounts[36].accNo,
        type: TransactionType.DEPOSIT,
        amount: 14000.0,
        date: new Date("2024-06-04"),
      },
      {
        accNo: accounts[36].accNo,
        type: TransactionType.PAYMENT,
        amount: 4500.0,
        date: new Date("2024-07-18"),
      },
      {
        accNo: accounts[37].accNo,
        type: TransactionType.DEPOSIT,
        amount: 320000.0,
        date: new Date("2024-01-19"),
      },
      {
        accNo: accounts[37].accNo,
        type: TransactionType.TRANSFER,
        amount: 100000.0,
        date: new Date("2024-03-31"),
      },
      {
        accNo: accounts[38].accNo,
        type: TransactionType.DEPOSIT,
        amount: 8000.0,
        date: new Date("2024-05-13"),
      },
      {
        accNo: accounts[38].accNo,
        type: TransactionType.WITHDRAWAL,
        amount: 2500.0,
        date: new Date("2024-07-09"),
      },
      {
        accNo: accounts[39].accNo,
        type: TransactionType.DEPOSIT,
        amount: 170000.0,
        date: new Date("2024-02-22"),
      },
      {
        accNo: accounts[39].accNo,
        type: TransactionType.PAYMENT,
        amount: 15000.0,
        date: new Date("2024-04-08"),
      },
      {
        accNo: accounts[40].accNo,
        type: TransactionType.DEPOSIT,
        amount: 27000.0,
        date: new Date("2024-03-06"),
      },
      {
        accNo: accounts[40].accNo,
        type: TransactionType.TRANSFER,
        amount: 8000.0,
        date: new Date("2024-06-26"),
      },
      {
        accNo: accounts[41].accNo,
        type: TransactionType.DEPOSIT,
        amount: 48000.0,
        date: new Date("2024-04-19"),
      },
      {
        accNo: accounts[41].accNo,
        type: TransactionType.WITHDRAWAL,
        amount: 14000.0,
        date: new Date("2024-07-12"),
      },
      {
        accNo: accounts[42].accNo,
        type: TransactionType.DEPOSIT,
        amount: 3500.0,
        date: new Date("2024-05-26"),
      },
      {
        accNo: accounts[42].accNo,
        type: TransactionType.PAYMENT,
        amount: 900.0,
        date: new Date("2024-07-19"),
      },
      {
        accNo: accounts[43].accNo,
        type: TransactionType.DEPOSIT,
        amount: 130000.0,
        date: new Date("2024-03-03"),
      },
      {
        accNo: accounts[43].accNo,
        type: TransactionType.TRANSFER,
        amount: 45000.0,
        date: new Date("2024-05-18"),
      },
      {
        accNo: accounts[44].accNo,
        type: TransactionType.DEPOSIT,
        amount: 19000.0,
        date: new Date("2024-04-28"),
      },
      {
        accNo: accounts[44].accNo,
        type: TransactionType.WITHDRAWAL,
        amount: 5500.0,
        date: new Date("2024-06-30"),
      },
      {
        accNo: accounts[45].accNo,
        type: TransactionType.DEPOSIT,
        amount: 380000.0,
        date: new Date("2024-02-02"),
      },
      {
        accNo: accounts[45].accNo,
        type: TransactionType.TRANSFER,
        amount: 110000.0,
        date: new Date("2024-04-13"),
      },
      {
        accNo: accounts[46].accNo,
        type: TransactionType.DEPOSIT,
        amount: 6000.0,
        date: new Date("2024-05-31"),
      },
      {
        accNo: accounts[46].accNo,
        type: TransactionType.PAYMENT,
        amount: 1500.0,
        date: new Date("2024-07-16"),
      },
      {
        accNo: accounts[47].accNo,
        type: TransactionType.DEPOSIT,
        amount: 90000.0,
        date: new Date("2024-03-14"),
      },
      {
        accNo: accounts[47].accNo,
        type: TransactionType.WITHDRAWAL,
        amount: 28000.0,
        date: new Date("2024-06-09"),
      },
      {
        accNo: accounts[48].accNo,
        type: TransactionType.DEPOSIT,
        amount: 24000.0,
        date: new Date("2024-04-24"),
      },
      {
        accNo: accounts[48].accNo,
        type: TransactionType.TRANSFER,
        amount: 7000.0,
        date: new Date("2024-07-04"),
      },
      {
        accNo: accounts[49].accNo,
        type: TransactionType.DEPOSIT,
        amount: 68000.0,
        date: new Date("2024-03-26"),
      },
      {
        accNo: accounts[49].accNo,
        type: TransactionType.PAYMENT,
        amount: 9500.0,
        date: new Date("2024-06-16"),
      },
      {
        accNo: accounts[50].accNo,
        type: TransactionType.DEPOSIT,
        amount: 13000.0,
        date: new Date("2024-05-06"),
      },
      {
        accNo: accounts[50].accNo,
        type: TransactionType.WITHDRAWAL,
        amount: 3000.0,
        date: new Date("2024-07-21"),
      },
      {
        accNo: accounts[51].accNo,
        type: TransactionType.DEPOSIT,
        amount: 195000.0,
        date: new Date("2024-02-11"),
      },
      {
        accNo: accounts[51].accNo,
        type: TransactionType.TRANSFER,
        amount: 60000.0,
        date: new Date("2024-05-24"),
      },
      {
        accNo: accounts[52].accNo,
        type: TransactionType.DEPOSIT,
        amount: 17000.0,
        date: new Date("2024-04-01"),
      },
      {
        accNo: accounts[52].accNo,
        type: TransactionType.PAYMENT,
        amount: 4000.0,
        date: new Date("2024-06-11"),
      },
      {
        accNo: accounts[53].accNo,
        type: TransactionType.DEPOSIT,
        amount: 260000.0,
        date: new Date("2024-03-09"),
      },
      {
        accNo: accounts[53].accNo,
        type: TransactionType.WITHDRAWAL,
        amount: 70000.0,
        date: new Date("2024-05-15"),
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
