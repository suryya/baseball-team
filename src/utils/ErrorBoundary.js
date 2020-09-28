import React from 'react';

export class ErrorBoundary extends React.Component {
    state = { hasError: false };
  
    static getDerivedStateFromError(error) {
      return { hasError: true };
    }
  
    componentDidCatch(error, info) {
      console.log('componentStack:',info.componentStack);
      console.log('error:',info.error);
    }
  
    render() {
      if (this.state.hasError) {
        return <h1>Something went wrong.</h1>;
      }
  
      return this.props.children; 
    }
  }


const WithErrorHandler = (WrappedComponent) => {
    
    class HOC extends React.Component {
      render() {
        return (<ErrorBoundary>
                  <WrappedComponent />
                </ErrorBoundary>)
      }
    }
    return HOC;
  };

export default WithErrorHandler