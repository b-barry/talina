import * as PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';
import {If} from '../components/if';
import {Loader} from '../components/loader';
import {
  FAILED_PROCESSING_STATE,
  PENDING_PROCESSING_STATE,
  START_PROCESSING_STATE,
  SUCCESS_PROCESSING_STATE
} from './constant';

const Card = ({ title, subTitle, note }) => (
  <div className="flex flex-row flex-wrap max-w-2xl bg-white mx-auto rounded-sm border-grey-lighter shadow-md">
    <div className="flex mx-8 my-8 px-8 py-8">
      <Loader width="100px" height="100px" />
    </div>
    <div className="flex flex-col justify-center  mt-4 w-3/4">
      <h1 className="mb-8">{title}</h1>
      <p className="mb-4 text-grey-dark">{subTitle}</p>
      <p className="mb-4 text-grey-dark">{note}</p>
    </div>
  </div>
);

export const PaymentProcessingState = props => (
  <div className={`mt-4 bg-grey-lighter py-16`}>
    <If
      condition={props.state === START_PROCESSING_STATE}
      then={
        <Card
          title={
            <FormattedMessage
              id="checkout.payment-processing-title"
              defaultMessage="##checkout.payment-processing-title"
            />
          }
          subTitle={
            <FormattedMessage
              id="app.processing-payment-redirection"
              defaultMessage="##app.processing-payment-redirection"
            />
          }
        />
      }
    />
    <If
      condition={props.state === PENDING_PROCESSING_STATE}
      then={
        <Card
          title={
            <FormattedMessage
              id="checkout.pending-payment-processing-title"
              defaultMessage="##checkout.pending-payment-processing-title"
            />
          }
          subTitle={
            <FormattedMessage
              id="checkout.pending-payment-processing-sub-title"
              defaultMessage="##checkout.pending-payment-processing-sub-title"
            />
          }
        />
      }
    />
    <If
      condition={props.state === SUCCESS_PROCESSING_STATE}
      then={
        <Card
          title={
            <FormattedMessage
              id="checkout.success-payment-processing-title"
              defaultMessage="##checkout.success-payment-processing-title"
            />
          }
          subTitle={
            <FormattedMessage
              id="checkout.success-payment-processing-sub-title"
              defaultMessage="##checkout.success-payment-processing-sub-title"
            />
          }
          note={
            <FormattedMessage
              id="checkout.success-payment-processing-note"
              defaultMessage="##checkout.success-payment-processing-note"
            />
          }
        />
      }
    />
    <If
      condition={props.state === FAILED_PROCESSING_STATE}
      then={
        <Card
          title={
            <FormattedMessage
              id="checkout.failed-payment-processing-title"
              defaultMessage="##checkout.success-payment-processing-title"
            />
          }
          subTitle={
            <FormattedMessage
              id="checkout.failed-payment-processing-sub-title"
              defaultMessage="##checkout.success-payment-processing-sub-title"
            />
          }
          note={
            <button>
              <FormattedMessage
                id="checkout.failed-payment-processing-action"
                defaultMessage="##checkout.failed-payment-processing-action"
              />
            </button>
          }
        />
      }
    />
  </div>
);

PaymentProcessingState.propTypes = { state: PropTypes.any };
