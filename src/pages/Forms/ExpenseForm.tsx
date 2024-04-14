import { useState } from 'react';
import { Button, Text, TextInput, Checkbox, Group, Flex, Paper, Title, Space } from '@mantine/core';
import { createAndAddResponseToForm } from '../../utils/formInterface';
import { useAuth } from '../../AuthContext';

interface Expense {
    date: string;
    vendor: string;
    budgetCategory: string;
    explanation: string;
    program: string;
    reimbursement: string;
    amount: string;
    [key: string]: string; // Index signature
  }

const ExpenseForm: React.FC<{ formID: string }> = ({ formID }) => {
  
  const { currentUser } = useAuth();
  const [employeeName, setEmployeeName] = useState('');
  const [dateOfAdvance, setDateOfAdvance] = useState('');
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [expenses, setExpenses] = useState([{ date: '', vendor: '', budgetCategory: '', explanation: '', program: '', reimbursement: '', amount: '' }]);

  const handleExpenseChange = (index: number, key: keyof Expense, value: string) => {
    const newExpenses = [...expenses];
    if (key === 'date' || key === 'vendor' || key === 'budgetCategory' || key === 'explanation' || key === 'program' || key === 'reimbursement' || key === 'amount') {
      newExpenses[index][key] = value;
      setExpenses(newExpenses);
    }
  };

  const handleAddExpense = () => {
    setExpenses([...expenses, { date: '', vendor: '', budgetCategory: '', explanation: '', program: '', reimbursement: '', amount: '' }]);
  };

  const handleSubmit = async () => {
    for (let i = 0; i < expenses.length; i++) {
      const expense = expenses[i];

      const responseFields = {
        responseID: crypto.randomUUID(),
        creatorID: currentUser?.uid || '',
        associatedYouthID: '', 
        timestamp: new Date(), 
        responses: Object.values(expense) 
      };

      const token = await currentUser?.getIdToken(); 
      if (!token) {
        throw new Error(
          "Authentication token is not available. Please log in."
        );
      } else {
          try {
            await createAndAddResponseToForm(formID, responseFields, token);
            console.log('Form response added successfully for expense:', i + 1);
          } catch (error) {
            console.error('Error adding form response for expense:', i + 1, error);
        
          }
      }
    }
  };



  return (
    <Paper bg={"missionSafeBlue.9"} w={"100%"} h={"100%"} radius={0} pl={40} pr={40}>
      <Space h="xl" />
      <Title order={2} fw={700} c="#5f737d" style={{ marginBottom: 20 }}>
        Expense Form
      </Title>
      <Flex 
        direction="column"
        gap={5}
        >
        <TextInput
            placeholder="Employee Name"
            value={employeeName}
            onChange={(event) => setEmployeeName(event.currentTarget.value)}
            style={{ marginBottom: 10 }}
        />
        <TextInput
            type="date"
            placeholder="Date of Advance"
            value={dateOfAdvance}
            onChange={(event) => setDateOfAdvance(event.currentTarget.value)}
            style={{ marginBottom: 20 }}
        />
        {expenses.map((expense, index) => (
            <div key={index} style={{ marginBottom: 20 }}>
                <Text size="sm" fw={700} style={{ marginBottom: 5 }} c="#758993">
                Expense #{index + 1}
                </Text>
                <Group>
                <TextInput
                    placeholder="Date"
                    value={expense.date}
                    onChange={(event) => handleExpenseChange(index, 'date', event.currentTarget.value)}
                    style={{ width: 'calc(100% / 7)', marginRight: 5 }}
                />
                <TextInput
                    placeholder="Vendor"
                    value={expense.vendor}
                    onChange={(event) => handleExpenseChange(index, 'vendor', event.currentTarget.value)}
                    style={{ width: 'calc(100% / 7)', marginRight: 5 }}
                />
                <TextInput
                    placeholder="Budget Category"
                    value={expense.budgetCategory}
                    onChange={(event) => handleExpenseChange(index, 'budgetCategory', event.currentTarget.value)}
                    style={{ width: 'calc(100% / 7)', marginRight: 5 }}
                />
                <TextInput
                    placeholder="Explanation of Business Purpose"
                    value={expense.explanation}
                    onChange={(event) => handleExpenseChange(index, 'explanation', event.currentTarget.value)}
                    style={{ width: 'calc(100% / 7)', marginRight: 5 }}
                />
                <TextInput
                    placeholder="Program"
                    value={expense.program}
                    onChange={(event) => handleExpenseChange(index, 'program', event.currentTarget.value)}
                    style={{ width: 'calc(100% / 7)', marginRight: 5 }}
                />
                <TextInput
                    placeholder="Cash Reimbursement or Card"
                    value={expense.reimbursement}
                    onChange={(event) => handleExpenseChange(index, 'reimbursement', event.currentTarget.value)}
                    style={{ width: 'calc(100% / 7)', marginRight: 5 }}
                />
                <TextInput
                    placeholder="Amount"
                    value={expense.amount}
                    onChange={(event) => handleExpenseChange(index, 'amount', event.currentTarget.value)}
                    style={{ width: 'calc(100% / 7)' }}
                />
                </Group>
            </div>
            ))}
        <Button onClick={handleAddExpense} style={{ marginBottom: 20 }}>
            Add Expense
        </Button>
        <Flex direction="row" align="center" justify="space-between">
            <Flex direction="row" gap={10}>
                <Text size="sm" style={{ marginBottom: 5 }} fw={700} c="#758993">
                I confirm that all information provided is accurate
                </Text>
                <Checkbox checked={confirmChecked} onChange={(event) => setConfirmChecked(event.currentTarget.checked)}/>
            </Flex>
            <Button disabled={!confirmChecked} onClick={handleSubmit} color="blue">
            Submit
            </Button>
        </Flex>
      </Flex>
    </Paper>
  );
};

export default ExpenseForm;