/**
 * 
 * 
 */

import { useForm } from "@refinedev/antd";
import { IResourceComponentsProps } from "@refinedev/core";
import { Button, Card, Form, Input, Radio, Row, Space, } from "antd";
import { useParams } from "react-router-dom";

export const EmptyQueue: React.FC<IResourceComponentsProps> = () => {
    const params = useParams<{ name: string }>()
    const { formProps, saveButtonProps, onFinish } = useForm<
        { id: string, cleaned: boolean, slug: string },
        any,
        { status: string, grace: string | number }>({
            resource: "clean-queue",
            successNotification: (data, values) => {
                if (values)
                    return {
                        message: `Job with type '${(values as { status: string }).status}' in Queue '${params.name}' has been cleaned.`,
                        description: 'Success cleaning queue',
                        type: "success"
                    }
                return {
                    message: `Job in Queue '${params.name}' has been cleaned.`,
                    description: 'Success cleaning queue',
                    type: "success"
                }
            }
        });

    if (params.name)
        return <Form {...formProps} layout="vertical" onFinish={(values) => {
            onFinish({ ...values, grace: Number(values.grace) })
        }}>
            <Card
                title="Empty Queue"
                style={{ marginBottom: "1em" }}
            >
                <Space direction="vertical">
                    <div>
                        This function only removes the jobs that are waiting to be processed by the queue or delayed. Jobs in other states (active, failed, completed) and Repeatable Job configurations will remain, and repeatable jobs will continue to be created on schedule.
                    </div>
                    <Button danger type="primary" {...saveButtonProps}>Empty</Button>
                </Space>
            </Card>
        </Form>
    return null;
}