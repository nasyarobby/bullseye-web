import {
    Refine,
    GitHubBanner,
    WelcomePage,
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

import dataProvider from "@refinedev/simple-rest";
import { App as AntdApp } from "antd"
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import routerBindings, { NavigateToResource, CatchAllNavigate, UnsavedChangesNotifier, DocumentTitleHandler } from "@refinedev/react-router-v6";
import { BlogPostCreate, BlogPostEdit, BlogPostShow, JobList } from "./pages/blog-posts";
import { CategoryList, CategoryCreate, CategoryEdit, CategoryShow } from "./pages/categories";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { Header } from "./components/header";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { ForgotPassword } from "./pages/forgotPassword";
import { authProvider } from "./authProvider";
import CustomSider from './components/CustomSider';
import { appDataProvider } from './data-providers';




function App() {
    return (
        <BrowserRouter>
            <GitHubBanner />
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
                                        <Route path="/queues/:name">
                                            <Route index element={<JobList />} />
                                            <Route path="create" element={<BlogPostCreate />} />
                                            <Route path="edit/:id" element={<BlogPostEdit />} />
                                            <Route path="show/:id" element={<BlogPostShow />} />
                                        </Route>
                                        <Route path="/blog-posts">
                                            <Route index element={<JobList />} />
                                            <Route path="create" element={<BlogPostCreate />} />
                                            <Route path="edit/:id" element={<BlogPostEdit />} />
                                            <Route path="show/:id" element={<BlogPostShow />} />
                                        </Route>
                                        <Route path="/categories">
                                            <Route index element={<CategoryList />} />
                                            <Route path="create" element={<CategoryCreate />} />
                                            <Route path="edit/:id" element={<CategoryEdit />} />
                                            <Route path="show/:id" element={<CategoryShow />} />
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
