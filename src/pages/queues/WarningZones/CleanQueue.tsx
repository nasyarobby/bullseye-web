import { useForm } from "@refinedev/antd";
import { IResourceComponentsProps } from "@refinedev/core";
import { Button, Card, Form, Input, Radio, Row, Space, } from "antd";
import { useParams } from "react-router-dom";

export const CleanQueue: React.FC<IResourceComponentsProps> = () => {
    const params = useParams<{ name: string }>()
    const { formProps, saveButtonProps, onFinish } = useForm<
    {id: string, cleaned: boolean, slug: string}, 
    any, 
    {status: string,grace: string | number}>({
        resource: "clean-queue",
        successNotification: (data, values) => {
            if(values)
            return {
                message: `Job with type '${(values as {status: string}).status}' in Queue '${params.name}' has been cleaned.`,
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
            onFinish({...values, grace: Number(values.grace)})
        }}>
            <Card
                title="Clean Queue"
                style={{ marginBottom: "1em" }}>
                <Space direction="vertical">
                    <div>Tells the queue to remove jobs of a specific status, created outside of a grace period.</div>
                    <Form.Item name={"status"} 
                    label="Job status"
                    rules={[{
                        required: true
                    }]}>
                        <Radio.Group optionType="default" value={"active"}>
                            <Radio.Button value="active">Active</Radio.Button>
                            <Radio.Button value="completed">Completed</Radio.Button>
                            <Radio.Button value="delayed">Delayed</Radio.Button>
                            <Radio.Button value="wait">Wait</Radio.Button>
                            <Radio.Button value="failed">Failed</Radio.Button>
                            <Radio.Button value="paused">Paused</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item name="grace" label="Grace (in milliseconds)."
                    rules={[
                        {required: true, message: "Please fill grace value."},
                        {
                            validator: (rule, value) => {
                                if(Number(value) < 0) {
                                    return Promise.reject("Grace value should not be less than 0.")
                                } 
                                return Promise.resolve(true);
                            }
                        }
                    ]}
                    >
                        <Input type="number"/>
                    </Form.Item>
                    <Button type="primary" danger
                        {...saveButtonProps}
                    >Clean</Button>
                </Space>
            </Card>
        </Form>
    return null;
}