import { ReactElement } from 'react';
import { Portfolio } from '../interfaces';


interface PortfolioDetailProps {
    portfolio: Portfolio;
}

function PortfolioDetails ({portfolio}: PortfolioDetailProps): ReactElement {
    return (
        <div id="PortfolioDetails">
                Your Portfolio: {portfolio.name}
                <br/>
                Cash: {portfolio.cash.toFixed(2)}
        </div>
            
    )
}

export default PortfolioDetails;