import { useForm } from "@refinedev/antd";
import { IResourceComponentsProps } from "@refinedev/core";
import { Button, Card, Form, Input, Radio, Row, Space, } from "antd";
import { useParams } from "react-router-dom";

export const RemoveJobs: React.FC<IResourceComponentsProps> = () => {
    const params = useParams<{ name: string }>()
    const { formProps, saveButtonProps } = useForm<
        { id: string, cleaned: boolean, slug: string },
        any,
        { pattern: string }>({
            resource: "remove-jobs",
            successNotification: (data, values) => {
                return {
                    message: `Jobs has been removed.`,
                    description: 'Success removing jobs',
                    type: "success"
                }
            }
        });

    if (params.name)
        return <Form {...formProps} layout="vertical" >
            <Card
                title="Remove Jobs"
                style={{ marginBottom: "1em" }}
            >
                <Space direction="vertical">
                    <div>Removes all the jobs (except repeatable jobs) which jobId matches the given pattern. The pattern must follow redis glob-style pattern (syntax) [<a href="https://redis.io/commands/keys">https://redis.io/commands/keys</a>]</div>
                    <div>Example ?oo* Will remove jobs with ids such as: "boo", "foofighter", etc.</div>
                    <Form.Item label="Pattern" name="pattern" required tooltip="This is a required field">
                        <Input placeholder="input placeholder" />
                    </Form.Item>
                    <Form.Item>
                        <Button danger type="primary" {...saveButtonProps}>Remove job</Button>
                    </Form.Item>
                </Space>
            </Card>
        </Form>
    return null;
}