import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LocaleProvider } from "@/context/LocaleContext";
import Navbar from "@/components/Navbar";
import HomePage from "@/pages/home";
import WizardPage from "@/pages/wizard";
import ConstitutionPage from "@/pages/constitution";
import DashboardPage from "@/pages/dashboard";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Layout><HomePage /></Layout>} />
      <Route path="/wizard" component={() => <Layout><WizardPage /></Layout>} />
      <Route path="/constitution" component={() => <Layout><ConstitutionPage /></Layout>} />
      <Route path="/dashboard" component={() => <Layout><DashboardPage /></Layout>} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LocaleProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </LocaleProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
