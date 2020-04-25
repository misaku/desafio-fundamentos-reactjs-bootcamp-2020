import React, { useState, useEffect } from 'react';
import crypto from 'crypto';
import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface ResponseData {
  transactions: Transaction[];
  balance: Balance;
}
const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const {
        data: { transactions: trans, balance: balan },
      } = await api.get<ResponseData>('/transactions');
      setTransactions(trans);
      setBalance(balan);
    }

    loadTransactions();
  }, []);

  function renderBalance(): JSX.Element {
    const {
      total: totalValue,
      income: incomeValue,
      outcome: outcomeValue,
    } = balance;
    return (
      <CardContainer>
        <Card>
          <header>
            <p>Entradas</p>
            <img src={income} alt="Income" />
          </header>
          <h1 data-testid="balance-income">
            {formatValue(Number(incomeValue))}
          </h1>
        </Card>
        <Card>
          <header>
            <p>Saídas</p>
            <img src={outcome} alt="Outcome" />
          </header>
          <h1 data-testid="balance-outcome">
            {formatValue(Number(outcomeValue))}
          </h1>
        </Card>
        <Card total>
          <header>
            <p>Total</p>
            <img src={total} alt="Total" />
          </header>
          <h1 data-testid="balance-total">{formatValue(Number(totalValue))}</h1>
        </Card>
      </CardContainer>
    );
  }
  function renderTransactions(): JSX.Element[] {
    return transactions.map(transaction => {
      const sinal = transaction.type === 'outcome' ? '- ' : '';
      const transactionValue = sinal + formatValue(Number(transaction.value));
      return (
        <tr key={transaction.id}>
          <td className="title">{transaction.title}</td>
          <td className={transaction.type}>{transactionValue}</td>
          <td>{transaction.category.title}</td>
          <td>
            {new Date(transaction.created_at).toLocaleDateString('pt-BR')}
          </td>
        </tr>
      );
    });
  }
  return (
    <>
      <Header />
      <Container>
        {renderBalance()}
        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>{renderTransactions()}</tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
