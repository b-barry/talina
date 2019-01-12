import * as PropTypes from 'prop-types';
import React from 'react';
import {If} from '../components/if';

export const PENDING_PROCESSING_STATE = 'pending_processing';
export const SUCCESS_PROCESSING_STATE = 'success_processing';
export const FAILED_PROCESSING_STATE = 'failed_processing';
export const NO_PROCESSING_STATE = '';
export const START_PROCESSING_STATE = 'start_processing';

export const PaymentProcessingState = props => (
  <div className={`mt-4 bg-grey-lighter py-16`}>
    <If
      condition={props.state === START_PROCESSING_STATE}
      then={
        <div className="flex flex-row flex-wrap max-w-2xl bg-white mx-auto rounded-sm border-grey-lighter shadow-md">
          <div className="flex mx-8 my-8 px-8 py-8">
            <svg
              width="100px"
              height="100px"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid"
              className="lds-eclipse"
              style={{background: 'none'}}
            >
              <path
                stroke="none"
                d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50"
                fill="#28292f"
                transform="rotate(125.793 50 51)"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  calcMode="linear"
                  values="0 50 51;360 50 51"
                  keyTimes="0;1"
                  dur="1s"
                  begin="0s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          </div>
          <div className="flex flex-col justify-center  mt-4 w-3/4">
            <h1 className="mb-8">Payment proccessing</h1>
            <p className="mb-4 text-grey-dark">You may be redirecting you</p>
          </div>
        </div>
      }
    />
    <If
      condition={props.state === PENDING_PROCESSING_STATE}
      then={
        <div className="flex flex-row flex-wrap max-w-2xl bg-white mx-auto rounded-sm border-grey-lighter shadow-md">
          <div className="flex mx-8 my-8 px-8 py-8">
            <svg
              width="100px"
              height="100px"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid"
              className="lds-eclipse"
              style={{background: 'none'}}
            >
              <path
                stroke="none"
                d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50"
                fill="#28292f"
                transform="rotate(125.793 50 51)"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  calcMode="linear"
                  values="0 50 51;360 50 51"
                  keyTimes="0;1"
                  dur="1s"
                  begin="0s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          </div>
          <div className="flex flex-col justify-center  mt-4 w-3/4">
            <h1 className="mb-8">Pending proccessing</h1>
            <p className="mb-4 text-grey-dark">You may be redirecting you</p>
          </div>
        </div>
      }
    />
    <If
      condition={props.state === SUCCESS_PROCESSING_STATE}
      then={
        <div className="flex flex-row flex-wrap max-w-2xl bg-white mx-auto rounded-sm border-grey-lighter shadow-md">
          <div className="flex mx-8 my-8 px-8 py-8">
            <svg
              width="100px"
              height="100px"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid"
              className="lds-eclipse"
              style={{background: 'none'}}
            >
              <path
                stroke="none"
                d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50"
                fill="#28292f"
                transform="rotate(125.793 50 51)"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  calcMode="linear"
                  values="0 50 51;360 50 51"
                  keyTimes="0;1"
                  dur="1s"
                  begin="0s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          </div>
          <div className="flex flex-col justify-center  mt-4 w-3/4">
            <h1 className="mb-8">Thanks for your order!</h1>
            <p className="mb-4 text-grey-dark">
              Woot! You successfully made a payment with Stripe.
            </p>
            <p className="mb-4 text-grey-dark">
              We just sent your receipt to your email address, and your items
              will be on their way shortly.
            </p>
          </div>
        </div>
      }
    />
    <If
      condition={props.state === FAILED_PROCESSING_STATE}
      then={
        <div className="flex flex-row flex-wrap max-w-2xl bg-white mx-auto rounded-sm border-grey-lighter shadow-md">
          <div className="flex mx-8 my-8 px-8 py-8">
            <svg
              width="100px"
              height="100px"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid"
              className="lds-eclipse"
              style={{background: 'none'}}
            >
              <path
                stroke="none"
                d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50"
                fill="#28292f"
                transform="rotate(125.793 50 51)"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  calcMode="linear"
                  values="0 50 51;360 50 51"
                  keyTimes="0;1"
                  dur="1s"
                  begin="0s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          </div>
          <div className="flex flex-col justify-center  mt-4 w-3/4">
            <h1 className="mb-8">Oops, payment failed.</h1>
            <p className="mb-4 text-grey-dark">
              It looks like your order could not be paid at this time. Please
              try again or select a different payment option.{' '}
            </p>
            <p className="mb-4 text-grey-dark">
              <button>Ressayez</button>
            </p>
          </div>
        </div>
      }
    />
  </div>
);

PaymentProcessingState.propTypes = {state: PropTypes.any};
