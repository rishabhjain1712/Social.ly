import { useEffect, useState } from 'react';

const ExpensiveCalculation = () => {
    const [result, setResult] = useState(0)
    
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
        <h1>{result}</h1>
      </div>
    );
};

export default ExpensiveCalculation