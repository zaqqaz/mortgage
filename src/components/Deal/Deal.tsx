import styled from "styled-components";
import React from "react";
import { v4 as uuid } from "uuid";
import { pmt, fv } from 'financial'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  border: 1px solid black;
  margin-top: 10px;
`;

const Rates = styled.div`
  display: flex;
  flex-direction: column;
`;

const Rate = styled.div`
  background: ${props => props.theme.color.secondaryBackground};
  border-bottom: 1px dashed ${props => props.theme.color.emphasis};
`;

const RateResult = styled.div`
  background: ${props => props.theme.color.warn};
  border-top: 1px dashed ${props => props.theme.color.emphasis};
`;

const FinalResults = styled.div`
  background: ${props => props.theme.color.success};
  border-bottom: 1px dashed ${props => props.theme.color.emphasis};
`;

const RatesTitle = styled.div`
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.color.emphasis};
  color: ${props => props.theme.color.white};
  text-align: center;
  padding: 5px;
`;

const Input = styled.input`
  padding: 0.5em;
  margin: 0.5em;
  color: ${props => props.theme.color.text};
  background: ${props => props.theme.color.inputBackground};
  border: none;
  border-radius: 3px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;

  label {
    flex: 1;
  }
`;

const AddButton = styled.button`
  background: ${props => props.theme.color.emphasis};
  color: ${props => props.theme.color.white};
  border: none;
  padding: 10px;
  margin: 10px;

  &:hover {
    opacity: .8;
  }
`;

const RemoveButton = styled.button`
  background: ${props => props.theme.color.danger};
  color: ${props => props.theme.color.text};
  border: none;
  padding: 10px;
  margin: 10px;
  display: flex;
  font-weight: bold;
  justify-content: center;
  align-items: center;

  &:hover {
    opacity: .8;
  }
`;

export type RateChanges = {
    key: string;
    durationInMonth: number;
    mortgageTermYears: number;
    ratePercentage: number;
    rateAfterPercentage: number;
    productFee: number;
    deposit: number;
}

export type DealStateProps = {
    id: string;
    propertyPrice?: number;
    rateChanges?: RateChanges[];
}
export type DealProps = DealStateProps & {
    onChange: (state: DealStateProps) => void;
}

function getInitialMortgageValues(): RateChanges {
    return{
        key: uuid(),
        mortgageTermYears: 20,
        durationInMonth: 24,
        ratePercentage: 2.37,
        rateAfterPercentage: 3.99,
        productFee: 0,
        deposit: 0,
    }
}

export const Deal: React.FC<DealProps> = (props) => {
    const [propertyPrice, setPropertyPrice] = React.useState(props.propertyPrice || 585000);
    const [rateChanges, setRateChanges] = React.useState<RateChanges[]>(props.rateChanges || [getInitialMortgageValues()]);

    React.useEffect(() => {
        props.onChange({
            id: props.id,
            propertyPrice,
            rateChanges
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [propertyPrice, rateChanges]);

    const resultsPerRate: any = [];

    for (let index = 0; index < rateChanges.length; index++) {
        const rate = rateChanges[index];
        const remainingPropertyPrice: number = index === 0 ? propertyPrice : resultsPerRate[index - 1].outstandingDept;
        const mortgageAmount = Math.abs(remainingPropertyPrice - rate.deposit);

        const monthlyPayment = pmt(rate.ratePercentage / 100 / 12, rate.mortgageTermYears * 12, mortgageAmount);
        const outstandingDept = Math.abs(fv(rate.ratePercentage / 100 / 12, rate.durationInMonth, monthlyPayment, mortgageAmount));
        const costOfBorrowing = Math.abs(monthlyPayment) * rate.durationInMonth - (mortgageAmount - Math.abs(outstandingDept)) + rate.productFee;
        const durationAfter = rate.mortgageTermYears * 12 - rate.durationInMonth;


        const monthlyPaymentAfter = pmt(rate.rateAfterPercentage / 100 / 12, durationAfter,  outstandingDept);

        // const outstandingDeptAfter = fv(rate.rateAfterPercentage / 100 / 12, durationAfter, monthlyPaymentAfter, outstandingDept);
        const costOfBorrowingAfter = Math.abs(monthlyPaymentAfter) * durationAfter - outstandingDept;


        resultsPerRate[index] = {
            mortgageAmount,
            monthlyPayment,
            outstandingDept,
            costOfBorrowing,
            costOfBorrowingAfter: costOfBorrowingAfter > 0 ? costOfBorrowingAfter : 0,
            monthlyPaymentAfter: monthlyPaymentAfter < 0 ? monthlyPaymentAfter : 0,
            rate
        }
    }

    let totalCostOfBorrowing = 0;
    let totalDuration = 0;

    for (let index = 0; index < resultsPerRate.length; index++) {
        const isLastOne = index === resultsPerRate.length - 1;
        const rate = rateChanges[index];

        totalDuration += rate.durationInMonth;
        totalCostOfBorrowing += resultsPerRate[index].costOfBorrowing;


        if (isLastOne && resultsPerRate[index].outstandingDept > 10) {
            totalCostOfBorrowing += resultsPerRate[index].costOfBorrowingAfter;
            totalDuration += rate.mortgageTermYears * 12 - rate.durationInMonth;
        }
    }

    const durationYears = Math.floor(totalDuration/12);
    const durationMonth = totalDuration - durationYears * 12;
    const totalDurationFormatted = `${durationYears} years | ${durationMonth} month`;


    return (
        <Container>
            <InputContainer>
                <label>
                    Property price
                </label>
                <Input value={propertyPrice} onChange={(e) => setPropertyPrice(+e.target.value)}/>
            </InputContainer>

            <Rates>
                <RatesTitle>
                    Mortgages plan
                </RatesTitle>
                {rateChanges.map((rate, index) => {
                    const key = rate.key;

                    const results = resultsPerRate[index];
                    return (
                        <Rate key={key}>
                            <InputContainer>
                                <label>
                                    Mortgage full terms years
                                </label>
                                <Input value={rate.mortgageTermYears} onChange={(e) => {
                                    const nexValue = +e.target.value;

                                    setRateChanges(rates => {
                                        const next = [...rates];
                                        next[index] = {
                                            ...next[index],
                                            mortgageTermYears: nexValue
                                        }

                                        return next;
                                    });
                                }}/>
                            </InputContainer>
                            <InputContainer>
                                <label>
                                    Deposit value
                                </label>
                                <Input value={rate.deposit} onChange={(e) => {
                                    const nexValue = +e.target.value;

                                    setRateChanges(rates => {
                                        const next = [...rates];
                                        next[index] = {
                                            ...next[index],
                                            deposit: nexValue
                                        }

                                        return next;
                                    })
                                }}/>
                            </InputContainer>
                            <InputContainer>
                                <label>
                                    1st Rate %
                                </label>
                                <Input value={rate.ratePercentage} onChange={(e) => {
                                    const nexValue = +e.target.value;

                                    setRateChanges(rates => {
                                        const next = [...rates];
                                        next[index] = {
                                            ...next[index],
                                            ratePercentage: nexValue
                                        }

                                        return next;
                                    })
                                }}/>
                            </InputContainer>
                            <InputContainer>
                                <label>
                                    1st Rate duration (month)
                                </label>
                                <Input value={rate.durationInMonth} onChange={(e) => {
                                    const nexValue = +e.target.value;

                                    setRateChanges(rates => {
                                        const next = [...rates];
                                        next[index] = {
                                            ...next[index],
                                            durationInMonth: nexValue
                                        }

                                        return next;
                                    })
                                }}/>
                            </InputContainer>
                            <InputContainer>
                                <label>
                                    Rate after %
                                </label>
                                <Input value={rate.rateAfterPercentage} onChange={(e) => {
                                    const nexValue = +e.target.value;

                                    setRateChanges(rates => {
                                        const next = [...rates];
                                        next[index] = {
                                            ...next[index],
                                            rateAfterPercentage: nexValue
                                        }

                                        return next;
                                    })
                                }}/>
                            </InputContainer>
                            <InputContainer>
                                <label>
                                    Product fee (not included to mortgage)
                                </label>
                                <Input value={rate.productFee} onChange={(e) => {
                                    const nexValue = +e.target.value;

                                    setRateChanges(rates => {
                                        const next = [...rates];
                                        next[index] = {
                                            ...next[index],
                                            productFee: nexValue
                                        }

                                        return next;
                                    })
                                }}/>
                            </InputContainer>

                            <RateResult>
                                <InputContainer>
                                    <label>
                                        Upfront payment <br />
                                        (deposit + fee)
                                    </label>
                                    <Input value={Math.ceil(rate.deposit + rate.productFee)} disabled/>
                                </InputContainer>

                                <InputContainer>
                                    <label>
                                        Monthly payment <br />
                                        (1st term)
                                    </label>
                                    <Input value={Math.ceil(results.monthlyPayment * -1)} disabled/>
                                </InputContainer>

                                <InputContainer>
                                    <label>
                                        Cost of borrowing <br />
                                        (1st term)
                                    </label>
                                    <Input value={Math.ceil(results.costOfBorrowing)} disabled/>
                                </InputContainer>

                                <InputContainer>
                                    <label>
                                        Outstanding dept <br />
                                        (after 1st term)
                                    </label>
                                    <Input value={Math.ceil(results.outstandingDept)} disabled/>
                                </InputContainer>

                                <InputContainer>
                                    <label>
                                        Monthly payment <br />
                                        (remaining term)
                                    </label>
                                    <Input value={Math.ceil(results.monthlyPaymentAfter * -1)} disabled/>
                                </InputContainer>

                                <InputContainer>
                                    <label>
                                        Cost of borrowing <br />
                                        (remaining term)
                                    </label>
                                    <Input value={Math.ceil(results.costOfBorrowingAfter)} disabled/>
                                </InputContainer>
                            </RateResult>

                            {<RemoveButton onClick={() => {
                                setRateChanges(rates => rates.filter(r => r.key !== key))
                            }}>
                                Delete mortgage
                            </RemoveButton>}
                        </Rate>
                    )
                })}

                <FinalResults>
                    <InputContainer>
                        <label>
                            TOTAL cost of borrowing
                        </label>
                        <Input value={Math.ceil(totalCostOfBorrowing)} disabled/>
                    </InputContainer>

                    <InputContainer>
                        <label>
                            TOTAL duration
                        </label>
                        <Input value={totalDurationFormatted} disabled/>
                    </InputContainer>
                </FinalResults>

                <AddButton onClick={() => {
                    setRateChanges(rates => {
                        const next = [...rates, getInitialMortgageValues()];

                        return next;
                    })
                }}>
                    Add remortgage
                </AddButton>
            </Rates>
        </Container>
    );
}

