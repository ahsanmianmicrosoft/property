import React, { useState, useMemo } from 'react';
import { Calculator } from 'lucide-react';
import { useRealEstate } from '../context/RealEstateContext';

interface MortgageCalculatorProps {
  propertyPrice: number;
}

export const MortgageCalculator: React.FC<MortgageCalculatorProps> = ({ propertyPrice }) => {
  const { formatPrice } = useRealEstate();

  const [price, setPrice] = useState<number>(propertyPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [loanTermYears, setLoanTermYears] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(14.5); // prevailing mortgage rate

  const calculation = useMemo(() => {
    const downPayment = (price * downPaymentPercent) / 100;
    const principal = price - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = loanTermYears * 12;

    let monthlyPayment = 0;
    if (monthlyRate > 0) {
      monthlyPayment =
        (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
        (Math.pow(1 + monthlyRate, totalPayments) - 1);
    } else {
      monthlyPayment = principal / totalPayments;
    }

    // Estimated insurance & tax
    const estimatedPropertyTax = (price * 0.005) / 12;
    const estimatedInsurance = (price * 0.002) / 12;
    const totalMonthly = monthlyPayment + estimatedPropertyTax + estimatedInsurance;

    return {
      downPayment,
      principal,
      monthlyPayment,
      estimatedPropertyTax,
      estimatedInsurance,
      totalMonthly
    };
  }, [price, downPaymentPercent, loanTermYears, interestRate]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
        <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-display font-bold text-slate-900 text-base">Mortgage & Financing Calculator</h3>
          <p className="text-xs text-slate-500">Estimate your monthly mortgage repayment plan</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between font-medium text-slate-700 mb-1">
              <span>Property Price</span>
              <span className="font-semibold text-slate-900 tabular-nums">{formatPrice(price)}</span>
            </div>
            <input
              type="range"
              min={1000000}
              max={350000000}
              step={1000000}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between font-medium text-slate-700 mb-1">
              <span>Down Payment ({downPaymentPercent}%)</span>
              <span className="font-semibold text-slate-900 tabular-nums">
                {formatPrice(calculation.downPayment)}
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={60}
              step={5}
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Loan Term</label>
              <select
                value={loanTermYears}
                onChange={(e) => setLoanTermYears(Number(e.target.value))}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white"
              >
                <option value={5}>5 Years</option>
                <option value={10}>10 Years</option>
                <option value={15}>15 Years</option>
                <option value={20}>20 Years</option>
                <option value={25}>25 Years</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Annual Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Results Breakdown */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 flex flex-col justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">Estimated Monthly Cost</p>
            <div className="text-2xl font-bold font-display text-slate-900 tabular-nums mt-1">
              {formatPrice(Math.round(calculation.totalMonthly))}
              <span className="text-xs font-normal text-slate-500"> / month</span>
            </div>
          </div>

          <div className="space-y-2 text-xs pt-4 border-t border-slate-200 text-slate-600">
            <div className="flex justify-between">
              <span>Principal & Interest</span>
              <span className="font-semibold text-slate-900 tabular-nums">{formatPrice(Math.round(calculation.monthlyPayment))}</span>
            </div>
            <div className="flex justify-between">
              <span>Property Taxes (Est.)</span>
              <span className="font-semibold text-slate-900 tabular-nums">{formatPrice(Math.round(calculation.estimatedPropertyTax))}</span>
            </div>
            <div className="flex justify-between">
              <span>Property Insurance (Est.)</span>
              <span className="font-semibold text-slate-900 tabular-nums">{formatPrice(Math.round(calculation.estimatedInsurance))}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
