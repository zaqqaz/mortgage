import styled from "styled-components";
import React, { useEffect } from "react";
import { v4 as uuid } from "uuid";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  border: 1px solid black;
`;

const Rates = styled.div`
  display: flex;
  flex-direction: column;
`;

const Rate = styled.div`
  background: ${props => props.theme.color.secondaryBackground};
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
}

export type DealStateProps = {
    id: string;
    mortgageSum?: number;
    fullTermYears?: number;
    rateChanges?: RateChanges[];
}
export type DealProps = DealStateProps & {
    onChange: (state: DealStateProps) => void;
}

export const Deal: React.FC<DealProps> = (props) => {
    const [mortgageSum, setMortgageSum] = React.useState(props.mortgageSum || 0);
    const [fullTermYears, setFullTermYears] = React.useState(props.fullTermYears || 0);
    const [rateChanges, setRateChanges] = React.useState(props.rateChanges || [{
        key: uuid(),
        durationInMonth: 24,
        ratePercentage: 1.74,
        productFee: 0
    }]);

    useEffect(() => {
        props.onChange({
            id: props.id,
            mortgageSum,
            fullTermYears,
            rateChanges
        });
    }, [mortgageSum, fullTermYears, rateChanges]);

    return (
        <Container>
            <InputContainer>
                <label>
                    Mortgage Sum
                </label>
                <Input value={mortgageSum} onChange={(e) => setMortgageSum(+e.target.value)}/>
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

                    return (
                        <Rate key={key}>
                            <InputContainer>
                                <label>
                                    Duration (0 - means till the end of the full term)
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

                            <RemoveButton onClick={() => {
                                setRateChanges(rates => rates.filter(r => r.key !== key))
                            }}>
                                Delete rate
                            </RemoveButton>
                        </Rate>
                    )
                })}
                <AddButton onClick={() => {
                    setRateChanges(rates => {
                        const next = [...rates, {
                            key: uuid(),
                            durationInMonth: 0,
                            ratePercentage: 1.74,
                            productFee: 0
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

