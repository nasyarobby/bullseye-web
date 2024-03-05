import {
    Refine,
    Authenticated,
} from '@refinedev/core';
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
    AuthPage, ErrorComponent
    , useNotificationProvider
    , ThemedLayoutV2
    , ThemedSiderV2
} from '@refinedev/antd';
import "@refinedev/antd/dist/reset.css";
import { SiRedis as RedisIcon } from "react-icons/si";

import { App as AntdApp } from "antd"
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import routerBindings, { NavigateToResource, CatchAllNavigate, UnsavedChangesNotifier, DocumentTitleHandler } from "@refinedev/react-router-v6";
import { QueueCreate, QueueEdit, BlogPostShow, QueuesList } from "./pages/queues";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { Header } from "./components/header";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { ForgotPassword } from "./pages/forgotPassword";
import { authProvider } from "./authProvider";
import CustomSider from './components/CustomSider';
import { appDataProvider } from './data-providers';
import { ConnectionsList } from './pages/connections/list';
import { ConnectionCreate } from './pages/connections/create';
import { JobList } from './pages/jobs';
import liveProvider from './live-providers';

function App() {
    return (
        <BrowserRouter>
            <RefineKbarProvider>
                <ColorModeContextProvider>
                    <AntdApp>
                        <DevtoolsProvider>
                            <Refine dataProvider={appDataProvider}
                                notificationProvider={useNotificationProvider}
                                routerProvider={routerBindings}
                                authProvider={authProvider}
                            
                                resources={[
                                    {
                                        name: "queues",
                                        list: "/queues",
                                        create: "/queues/create",
                                        edit: "/queues/edit/:id",
                                        show: "/queues/show/:id",
                                        meta: {
                                            canDelete: true,
                                        },
                                    },
                                    {
                                        name: "jobs",
                                        list: "/queues/:id",
                                        create: "/queues/:id/create",
                                        edit: "/queues/:id/edit/:id",
                                        show: "/queues/:id/show/:id",
                                        meta: {
                                            canDelete: true,
                                            hide: true
                                        },
                                    },
                                    {
                                        name: "connections",
                                        list: "/connections",
                                        create: "/connections/create",
                                        edit: "/connections/edit/:id",
                                        show: "/connections/show/:id",
                                        icon: <RedisIcon />,
                                        meta: {
                                            canDelete: true,
                                        },
                                    },
                                ]}
                                options={{
                                    syncWithLocation: true,
                                    warnWhenUnsavedChanges: true,
                                    useNewQueryKeys: true,
                                    projectId: "I0JTBB-flklF0-ptDaOn",

                                }}
                            >
                                <Routes>
                                    <Route
                                        element={
                                            <Authenticated
                                                key="authenticated-inner"
                                                fallback={<CatchAllNavigate to="/login" />}
                                            >
                                                <ThemedLayoutV2
                                                    Header={() => <Header sticky />}
                                                    Sider={(props) => <CustomSider {...props} fixed />}
                                                >
                                                    <Outlet />
                                                </ThemedLayoutV2>
                                            </Authenticated>
                                        }
                                    >
                                        <Route index element={
                                            <NavigateToResource resource="blog_posts" />
                                        } />
                                        <Route path="/queues">
                                            <Route index element={<QueuesList />} />
                                            <Route path="create" element={<QueueCreate />} />
                                            <Route path="edit/:id" element={<QueueEdit />} />
                                            <Route path="show/:id" element={<BlogPostShow />} />
                                            <Route path=":name" element={<JobList />}>
                                                <Route path="create" element={<QueueCreate />} />
                                                <Route path="edit/:id" element={<QueueEdit />} />
                                                <Route path="show/:id" element={<BlogPostShow />} />
                                            </Route>
                                        </Route>

                                        <Route path="/connections">
                                            <Route index element={<ConnectionsList />} />
                                            <Route path="create" element={<ConnectionCreate />} />
                                            <Route path="edit/:id" element={<QueueEdit />} />
                                            <Route path="show/:id" element={<BlogPostShow />} />
                                        </Route>
                                        <Route path="*" element={<ErrorComponent />} />
                                    </Route>
                                    <Route
                                        element={
                                            <Authenticated key="authenticated-outer" fallback={<Outlet />}>
                                                <NavigateToResource />
                                            </Authenticated>
                                        }
                                    >
                                        <Route path="/login" element={<Login />} />
                                        <Route path="/register" element={<Register />} />
                                        <Route path="/forgot-password" element={<ForgotPassword />} />
                                    </Route>
                                </Routes>


                                <RefineKbar />
                                <UnsavedChangesNotifier />
                                <DocumentTitleHandler />
                            </Refine>
                            <DevtoolsPanel />
                        </DevtoolsProvider>
                    </AntdApp>
                </ColorModeContextProvider>
            </RefineKbarProvider>
        </BrowserRouter>
    );
}

export default App;
