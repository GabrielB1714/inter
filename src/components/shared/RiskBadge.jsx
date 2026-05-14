import { getRiskClassName } from '../../utils/academicCalculations.js';

function RiskBadge({ risk }) {
  return <span className={`risk-badge ${getRiskClassName(risk)}`}>{risk}</span>;
}

export default RiskBadge;
