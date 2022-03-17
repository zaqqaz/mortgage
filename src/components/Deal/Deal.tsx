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
    ratePercentage: number;
    productFee: number;
    depositPercentage: number;
}

export type DealStateProps = {
    id: string;
    propertyPrice?: number;
    fullTermYears?: number;
    rateChanges?: RateChanges[];
}
export type DealProps = DealStateProps & {
    onChange: (state: DealStateProps) => void;
}

export const Deal: React.FC<DealProps> = (props) => {
    const [propertyPrice, setPropertyPrice] = React.useState(props.propertyPrice || 0);
    const [fullTermYears, setFullTermYears] = React.useState(props.fullTermYears || 0);
    const [rateChanges, setRateChanges] = React.useState(props.rateChanges || [{
        key: uuid(),
        durationInMonth: 24,
        ratePercentage: 1.74,
        productFee: 0,
        depositPercentage: 10,
    }]);

    React.useEffect(() => {
        props.onChange({
            id: props.id,
            propertyPrice,
            fullTermYears,
            rateChanges
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [propertyPrice, fullTermYears, rateChanges]);

    const resultsPerRate: any = [];
    let totalCostOfBorrowing = 0;

    for (let index = 0; index < rateChanges.length; index++) {
        const rate = rateChanges[index];
        const remainingPropertyPrice: number = index === 0 ? propertyPrice : resultsPerRate[index - 1].outstandingDept;
        const mortgageAmount = Math.abs(remainingPropertyPrice - rate.depositPercentage / 100 * remainingPropertyPrice);
        const remainingMortgageDuration: number = index === 0 ? fullTermYears * 12 : resultsPerRate[index - 1].remainingMortgageDuration - resultsPerRate[index - 1].rate.durationInMonth;
        const monthlyPayment = pmt(rate.ratePercentage / 100 / 12, remainingMortgageDuration, mortgageAmount);
        const outstandingDept = fv(rate.ratePercentage / 100 / 12, rate.durationInMonth, monthlyPayment, mortgageAmount);
        const costOfBorrowing = Math.abs(monthlyPayment) * rate.durationInMonth - (mortgageAmount - Math.abs(outstandingDept)) + rate.productFee;

        totalCostOfBorrowing += costOfBorrowing;

        resultsPerRate[index] = {
            mortgageAmount,
            remainingMortgageDuration,
            monthlyPayment,
            outstandingDept,
            costOfBorrowing,
            rate
        }
    }

    return (
        <Container>
            <InputContainer>
                <label>
                    Property price
                </label>
                <Input value={propertyPrice} onChange={(e) => setPropertyPrice(+e.target.value)}/>
            </InputContainer>

            <InputContainer>
                <label>
                    Full terms years
                </label>
                <Input value={fullTermYears} onChange={(e) => setFullTermYears(+e.target.value)}/>
            </InputContainer>

            <Rates>
                <RatesTitle>
                    Rates
                </RatesTitle>
                {rateChanges.map((rate, index) => {
                    const key = rate.key;

                    const results = resultsPerRate[index];
                    return (
                        <Rate key={key}>
                            <InputContainer>
                                <label>
                                    Duration
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
                                    Rate percentage
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

                            <InputContainer>
                                <label>
                                    % Deposit
                                </label>
                                <Input value={rate.depositPercentage} onChange={(e) => {
                                    const nexValue = +e.target.value;

                                    setRateChanges(rates => {
                                        const next = [...rates];
                                        next[index] = {
                                            ...next[index],
                                            depositPercentage: nexValue
                                        }

                                        return next;
                                    })
                                }}/>
                            </InputContainer>

                            {rateChanges.length > 1 && <RemoveButton onClick={() => {
                                setRateChanges(rates => rates.filter(r => r.key !== key))
                            }}>
                                Delete rate
                            </RemoveButton>}

                            <RateResult>

                                <InputContainer>
                                    <label>
                                        Monthly payment
                                    </label>
                                    <Input value={Math.ceil(Math.abs(results.monthlyPayment))} disabled/>
                                </InputContainer>

                                <InputContainer>
                                    <label>
                                        Outstanding dept
                                    </label>
                                    <Input value={Math.ceil(Math.abs(results.outstandingDept))} disabled/>
                                </InputContainer>

                                <InputContainer>
                                    <label>
                                        Cost of borrowing
                                    </label>
                                    <Input value={Math.ceil(results.costOfBorrowing)} disabled/>
                                </InputContainer>

                            </RateResult>
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
                </FinalResults>

                <AddButton onClick={() => {
                    setRateChanges(rates => {
                        const next = [...rates, {
                            key: uuid(),
                            durationInMonth: 0,
                            ratePercentage: 1.74,
                            productFee: 0,
                            depositPercentage: 0
                        }];

                        return next;
                    })
                }}>
                    Add
                </AddButton>
            </Rates>
        </Container>
    );
}

