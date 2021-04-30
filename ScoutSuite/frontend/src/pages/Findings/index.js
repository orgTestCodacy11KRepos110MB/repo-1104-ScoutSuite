import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import isEmpty from 'lodash/isEmpty';

import { useAPI } from '../../api/useAPI';
import { getFindingsEndpoint } from '../../api/paths';
import { sortBySeverity } from '../../utils/Severity/sort';
import Table from '../../components/Table';
import Name from './formatters/Name';
import Description from './formatters/Description/index';
import Severity from './formatters/Severity/index';
import Breadcrumb from '../../components/Breadcrumb/index';

import './style.scss';

const getAllFindings = findings =>
  findings
    ? findings.map(item => ({
      id: item.name,
      severity: item.flagged_items === 0 ? 'success' : item.level,
      name: item.description,
      flagged: `${item.flagged_items}/${item.checked_items}`,
      description: item.rationale,
      references: item.references,
      remediation: item.remediation,
      flagged_items: item.flagged_items,
      compliance: item.compliance,
      redirect_to: item.redirect_to,
    }))
    : [];

const Findings = () => {
  const params = useParams();
  const { data: findings, loading } = useAPI(
    getFindingsEndpoint(params.service),
  );
  const [findingsList, setFindingsList] = useState([]);

  useEffect(() => {
    setFindingsList(getAllFindings(findings));
  }, [findings]);

  const fetchData = React.useCallback(
    ({ search }) => {
      if (search && search.length > 0)
        setFindingsList(
          getAllFindings(findings).filter(finding =>
            finding.name.toLowerCase().includes(search.toLowerCase()),
          ),
        );
      else {
        setFindingsList(getAllFindings(findings));
      }
    },
    [findings],
  );

  if (loading) return null;

  if (isEmpty(findings)) {
    return (
      <>
        <Breadcrumb />
        <div className="findings">
          <div className="table-card no-items">
            <CheckCircleOutlineOutlinedIcon /> No findings for this service.
          </div>
        </div>
      </>
    );
  }

  const columns = [
    { name: 'Severity', key: 'severity', sortInverted: true },
    { name: 'Name', key: 'name' },
    { name: 'Flagged Resources', key: 'flagged', sortInverted: true },
    { name: 'Description', key: 'description' },
  ];

  const initialState = {
    sortBy: [
      {
        id: 'severity',
        desc: false,
      },
    ],
    pageSize: 25,
  };

  const formatters = {
    name: Name,
    description: Description,
    severity: Severity,
  };

  const sortBy = {
    severity: sortBySeverity,
  };

  return (
    <>
      <Breadcrumb />
      <div className="findings">
        <div className="table-card">
          <Table
            columns={columns}
            data={findingsList}
            initialState={initialState}
            formatters={formatters}
            sortBy={sortBy}
            fetchData={fetchData}
          />
        </div>
      </div>
    </>
  );
};

export default Findings;