import React from 'react';
import { PropTypes } from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';

import { Partial } from '../../../components/Partial';
import { partialDataShape } from '../../../utils/Partials';
import PartialValue from '../../../components/Partial/PartialValue/index';
import {
  convertBoolToEnable,
  convertValueOrNever,
  convertListToChips,
} from '../../../utils/Partials/index';
import { TabPane, TabsMenu } from '../../../components/Partial/PartialTabs';
import InformationsWrapper from '../../../components/InformationsWrapper';


const propTypes = {
  data: PropTypes.shape(partialDataShape).isRequired,
};

const renderBlobContainer = data => {
  return (<li key={data.id}>
    <b>{data.id}</b>
    <ul>
      <PartialValue
        label="Public Access Allowed"
        valuePath={`blob_containers.${data.id}.public_access_allowed`}
        renderValue={convertBoolToEnable}
      />
    </ul>
  </li>);
};
const renderBlobService = data => {
  return (<li key={data.id}>
    <b>{data.name}</b>
    <ul>
      <PartialValue
        label="Soft Delete"
        valuePath={`blob_services.${data.id}.soft_delete_enabled`}
        renderValue={convertBoolToEnable}
      />
    </ul>
  </li>);
};

const Bucket = (props) => {
  const { data } = props;

  if (!data) return null;


  const blob_containers = get(data, ['item', 'blob_containers']);
  const blob_services = get(data, ['item', 'blob_services']);

  return (
    <Partial data={data}>
      <InformationsWrapper>
        <PartialValue
          label="Storage Account Name"
          valuePath="name"
        />
        <PartialValue
          label="Public Traffic"
          valuePath="public_traffic_allowed"
          renderValue={convertBoolToEnable}
        />
        <PartialValue
          label="HTTPS Required"
          valuePath="https_traffic_enabled"
          renderValue={convertBoolToEnable}
        />
        <PartialValue
          label="Microsoft Trusted Services"
          valuePath="trusted_microsoft_services_enabled"
          renderValue={convertBoolToEnable}
        />
        <PartialValue
          label="Last Access Key Rotation"
          valuePath="access_keys_rotated"
          renderValue={convertValueOrNever}
        />
        <PartialValue
          label="Storage encrypted with Customer Managed Key"
          valuePath="encryption_key_customer_managed"
          renderValue={convertBoolToEnable}
        />
        <PartialValue
          label="Tags"
          valuePath="tags"
          renderValue={convertListToChips}
        />
        <PartialValue
          label="Resource group"
          valuePath="resource_group_name"
          renderValue={convertValueOrNever}
        />
      </InformationsWrapper>

      <TabsMenu>
        <TabPane title="Blob Containers">
          {!isEmpty(blob_containers) ? (
            <ul>
              {Object.values(blob_containers).map((value) =>
                renderBlobContainer(value)
              )}</ul>
          ) : (
            <span>None</span>
          )}
        </TabPane>
        <TabPane title="Blob Services">
          {!isEmpty(blob_services) ? (
            <ul>
              {Object.values(blob_services).map((value) => renderBlobService(value)
              )}
            </ul>
          ) : (
            <span>None</span>
          )}
        </TabPane>
      </TabsMenu>
    </Partial >
  );
};

Bucket.propTypes = propTypes;

export default Bucket;