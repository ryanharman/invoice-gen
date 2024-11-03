/* eslint-disable no-console, react/destructuring-assignment, react/state-in-constructor */
import { AlertCircle } from "lucide-react";
import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: "Sorry, there was an error",
  };

  public static getDerivedStateFromError(): State {
    return {
      hasError: true,
      errorMessage:
        "Sorry, there was an error. Please try again or raise an issue https://github.com/ryanharman/invoice-gen/issues.",
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="h-full items-center justify-center">
          <AlertCircle className="h-16 w-16 text-red-500" />
          <p className="text-lg font-medium">{this.state.errorMessage}</p>
        </div>
      );
    }

    return this.props.children;
  }
}
