-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'PAYMENT');

-- CreateTable
CREATE TABLE "customer" (
    "customer_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "branch_id" INTEGER NOT NULL,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("customer_id")
);

-- CreateTable
CREATE TABLE "customer_phone" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "phone_number" TEXT NOT NULL,

    CONSTRAINT "customer_phone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "acc_no" SERIAL NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "account_pkey" PRIMARY KEY ("acc_no")
);

-- CreateTable
CREATE TABLE "customer_account" (
    "customer_id" INTEGER NOT NULL,
    "acc_no" INTEGER NOT NULL,

    CONSTRAINT "customer_account_pkey" PRIMARY KEY ("customer_id","acc_no")
);

-- CreateTable
CREATE TABLE "loan" (
    "loan_id" SERIAL NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "loan_pkey" PRIMARY KEY ("loan_id")
);

-- CreateTable
CREATE TABLE "customer_loan" (
    "customer_id" INTEGER NOT NULL,
    "loan_id" INTEGER NOT NULL,

    CONSTRAINT "customer_loan_pkey" PRIMARY KEY ("customer_id","loan_id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "transaction_id" SERIAL NOT NULL,
    "acc_no" INTEGER NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateTable
CREATE TABLE "branch" (
    "branch_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,

    CONSTRAINT "branch_pkey" PRIMARY KEY ("branch_id")
);

-- CreateTable
CREATE TABLE "employee" (
    "employee_id" SERIAL NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "salary" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("employee_id")
);

-- CreateTable
CREATE TABLE "employee_phone" (
    "id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "phone_number" TEXT NOT NULL,

    CONSTRAINT "employee_phone_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "customer" ADD CONSTRAINT "customer_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branch"("branch_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_phone" ADD CONSTRAINT "customer_phone_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_account" ADD CONSTRAINT "customer_account_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_account" ADD CONSTRAINT "customer_account_acc_no_fkey" FOREIGN KEY ("acc_no") REFERENCES "account"("acc_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_loan" ADD CONSTRAINT "customer_loan_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_loan" ADD CONSTRAINT "customer_loan_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "loan"("loan_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_acc_no_fkey" FOREIGN KEY ("acc_no") REFERENCES "account"("acc_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branch"("branch_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_phone" ADD CONSTRAINT "employee_phone_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;
