import React from "react";
import { Card, Button } from "@heroui/react";
import { Icon } from "@iconify/react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Component error:", error, errorInfo);
    // Here you could send the error to an error reporting service
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <Card className="p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <Icon icon="lucide:alert-triangle" className="text-danger text-5xl" />
            <h2 className="text-xl font-semibold">Something went wrong</h2>
            <p className="text-default-500 mb-4">
              An error occurred while rendering this component.
            </p>
            {this.state.error && (
              <div className="bg-danger-50 dark:bg-danger-900/20 p-4 rounded-md text-left mb-4 max-w-full overflow-auto">
                <p className="font-mono text-sm text-danger-700 dark:text-danger-300">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
            <Button 
              color="primary"
              onPress={() => this.setState({ hasError: false, error: null })}
            >
              Try Again
            </Button>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}