import ReactGA from "react-ga4";

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

export const initAnalytics = () => {
  if (!measurementId) {
    console.warn("Google Analytics Measurement ID is missing.");
    return;
  }

  ReactGA.initialize(measurementId);
};

export const trackPageView = (path) => {
  if (!measurementId) return;

  ReactGA.send({
    hitType: "pageview",
    page: path,
  });
};

export const trackEvent = (eventName, parameters = {}) => {
  if (!measurementId) return;

  ReactGA.event(eventName, parameters);
};