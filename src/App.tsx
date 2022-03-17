import React from 'react';
import styled from "styled-components";
import { ThemeProvider } from "./theme/ThemeProvider";
import { GlobalStyle } from "./components/GlobalStyles/GlobalStyles";
import { Deal, DealStateProps } from "./components/Deal/Deal";
import { v4 as uuid } from "uuid";

const LayoutWrapper = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  overflow: scroll;
  margin-bottom: 10px;
`;

const DealContainer = styled.div`
  margin-right: 10px;
`;

const AddButton = styled.button`
  background: ${props => props.theme.color.success};
  color: ${props => props.theme.color.text};
  border: none;
  margin: 10px;
  display: flex;
  font-weight: bold;
  justify-content: center;
  align-items: center;
  padding: 20px;
  height: 40px;
  min-width: 100px;

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

export const encodeBase64 = (data: any) => {
    return btoa(JSON.stringify(data));
}
export const decodeBase64 = (data: any) => {
    return JSON.parse(atob(data));
}

export const App: React.FC = () => {
    const urlParams = new URLSearchParams(window.location.search);

    const initialDeals = urlParams.get('deals') ? decodeBase64(urlParams.get('deals')!) as DealStateProps[] : [{
        id: uuid(),
    }];

    const [deals, setDeals] = React.useState<DealStateProps[]>(initialDeals);

    React.useEffect(() => {
        const encoded = encodeBase64(deals);
        window.history.replaceState(deals, '', `?deals=${encoded}`);
    }, [deals]);

    return (
        <ThemeProvider>
            <GlobalStyle/>
            <LayoutWrapper>
                {deals.map((v, i) => {
                    return <DealContainer key={v.id}>
                        <RemoveButton onClick={() => {
                            setDeals(deals => deals.filter((deal) => deal !== v))
                        }
                        }>Delete deal</RemoveButton>
                        <Deal {...v} onChange={(state) => {

                            setDeals(deals => {
                                const next = [...deals];
                                next[i] = {
                                    ...next[i],
                                    ...state,
                                }

                                return next;
                            });
                        }}/>
                    </DealContainer>;
                })}

                <AddButton onClick={() => setDeals(v => [...v, { id: uuid() }])}>Add deal</AddButton>
            </LayoutWrapper>
        </ThemeProvider>
    );
}

