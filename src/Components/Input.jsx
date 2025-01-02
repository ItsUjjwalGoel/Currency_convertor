import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GitHub from './Githublogo.png';
import Linkedin from './Linkedin.png'
function Input() {
    const [selectCurrency, setselectcurrency] = useState('USD');
    const [selectCurrencyintoconverted, setselectCurrencyintoconverted] = useState('EUR');
    const [amount, setamount] = useState(0);
    const [amountvalue, setamountvalue] = useState(0);
    const [exchangeRates, setExchangeRates] = useState({});

    // Fetch the currency data from the API
    useEffect(() => {
        const fetchExchangeRates = async () => {
            try {
                const response = await axios.get('https://api.currencyapi.com/v3/latest?apikey=cur_live_fAs7RC4hiLbYMZnnyjSg6mMyHlDJG79jmKHFWeXt');
                const data = response.data.data;

                // Transform the data into the nested object format
                const transformedRates = {};

                Object.keys(data).forEach((baseCurrency) => {
                    transformedRates[baseCurrency] = {};
                    Object.keys(data).forEach((targetCurrency) => {
                        if (baseCurrency !== targetCurrency) {
                            // Calculate the exchange rate between the currencies
                            transformedRates[baseCurrency][targetCurrency] = data[targetCurrency].value / data[baseCurrency].value;
                        }
                    });
                });

                setExchangeRates(transformedRates);
            } catch (error) {
                console.error('Error fetching exchange rates:', error);
            }
        };

        fetchExchangeRates();
    }, []);


    const handleswap = () => {
        let temp = selectCurrency;
        setselectcurrency(selectCurrencyintoconverted);
        setselectCurrencyintoconverted(temp);
    };
    const handlebutton = () => {
        setamount(0);
        setamountvalue(0);
    }

    useEffect(() => {
        if (exchangeRates[selectCurrency] && exchangeRates[selectCurrency][selectCurrencyintoconverted]) {
            setamountvalue((exchangeRates[selectCurrency][selectCurrencyintoconverted] * amount).toFixed(3));
        }
    }, [amount, selectCurrency, selectCurrencyintoconverted, exchangeRates]);


    useEffect(() => {
        const handle = (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                handleswap();
            }
            if (e.ctrlKey && e.key === 'r') {
                setamount(0);
                setamountvalue(0);
            }
        };
        window.addEventListener('keydown', handle);
        return () => {
            window.removeEventListener('keydown', handle);
        };
    }, [handleswap]);

    return (
        <>
            <header className=' absolute top-0 h-20 bg-blue-100 w-full flex items-center justify-center flex-wrap'>
                <button
                    onClick={handlebutton}
                    className='ml-12 bg-white pl-1 pr-1 border-2 border-blue-300 rounded-lg left-0 absolute'> Home</button>

                <div
                    className='border-2 rounded-lg absolute right-24 flex  items-center gap-2'>

                    <a href=" https://github.com/ItsUjjwalGoel" target='blank'><img src={GitHub} alt="" className='w-8 h-8 border-1 rounded-full' /></a>
                    <a href=" https://linkedin.com/in/its-ujjwal" target='blank'><img src={Linkedin} alt="" className='w-8 h-8 border-1 rounded-full' /></a>

                </div>
                <label htmlFor=""
                className='text-xl '>Currency Convertor</label>
            </header>
            <div className="flex content-center flex-wrap h-lvh">
                <div className="flex-wrap flex justify-center flex-col bg-blue-50 p-4 border-2 border-gray-500 rounded-lg w-3/5 m-auto">
                    <label htmlFor="" className="p-4 m-auto text-xl">Currency Converter</label>
                    <div className="text-gray-600 text-sm flex justify-end pr-10 ">Currency Type</div>
                    <div className="flex flex-col justify-center align-center gap-7">
                        <div className="flex center items-center gap-2 hover:cursor-pointer">
                            <label htmlFor="">Amount</label>
                            <input
                                type="number"
                                className="bg-white p-4 w-4/6 h-3/5 rounded-lg ml-20 mr-6"
                                value={amount}
                                onChange={(e) => setamount(e.target.value)}
                            />
                            <div className="flex flex-col gap-3">

                                <select
                                    className="  border-2 border-blue-200 rounded-lg h-10 w-30 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-300 overflow-y-auto    "
                                    value={selectCurrency}

                                    onChange={(e) => setselectcurrency(e.target.value)}
                                >
                                    {Object.keys(exchangeRates).map((key) => (
                                        <option key={key} value={key} className='hover:bg-blue-100' size={5}>
                                            {key}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <button
                            className=" pl-3 pr-3 border-2 border-blue-200 rounded-lg m-auto mt-0 mb-0"
                            onClick={handleswap}
                        >
                            Swap
                        </button>
                        <div className="text-gray-600 text-sm flex justify-end pr-5">Currency Type</div>
                        <div className="flex align-center justify-center flex-wrap items-center gap-2">
                            <label htmlFor="">Converted Amount</label>
                            <input
                                type="number"
                                className="bg-white p-4 w-4/6 h-3/5 rounded-lg mr-7 "
                                value={amountvalue}
                                onChange={(e) => setamountvalue(e.target.value)}
                            />
                            <div className="flex flex-col gap-3">

                                <select
                                    className=" h-10 w-30 border-2 border-blue-200 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-300"
                                    value={selectCurrencyintoconverted}

                                    onChange={(e) => setselectCurrencyintoconverted(e.target.value)}
                                >
                                    {Object.keys(exchangeRates[selectCurrency] || {}).map((key) => (
                                        <option key={key} value={key} className='hover:bg-blue-100' size={5} >
                                            {key}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <label htmlFor="" className='absolute bottom-3 right-3 text-blue-500 shadow-lg shadow-blue-200 p-1 border rounded-lg '>Made by Ujjwal</label>
            </div>
        </>
    );
}

export default Input;
