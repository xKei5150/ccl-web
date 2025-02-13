'use client';

import { Component } from 'react';
import { DashboardError } from './DashboardError';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Dashboard error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <DashboardError error={this.state.error} />;
    }

    return this.props.children;
  }
}