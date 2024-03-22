import { useForm } from "@refinedev/antd";
import { IResourceComponentsProps } from "@refinedev/core";
import { Button, Card, Checkbox, Form, Space, } from "antd";
import { useParams } from "react-router-dom";

export const ObliterateQueue: React.FC<IResourceComponentsProps> = () => {
    const params = useParams<{ name: string }>()
    const { formProps, saveButtonProps } = useForm<
        { id: string, cleaned: boolean, slug: string },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        any,
        { force: string | boolean }>({
            resource: "obliterate",
            successNotification: (data, values) => {
                return {
                    message: `Queue '${data?.data.slug}' has been obliterated. (Force ${(values as {force: boolean}).force ? 'true' : 'false'})`,
                    description: 'Success obliterate queue',
                    type: "success"
                }
            }
        });

    if (params.name)
        return <Form {...formProps} layout="vertical">
            <Card
                title="Obliterate Queue"
                style={{ marginBottom: "1em" }}
            >
                <Space direction="vertical">
                    <div>
                        Completely removes a queue with all its data. In order to obliterate a queue there cannot be active jobs, but this behaviour can be overrided with the "force" option.
                    </div>
                    <div>
                        Note: since this operation can be quite long in duration depending on how many jobs there are in the queue, it is not performed atomically, instead is performed iterativelly. However the queue is always paused during this process, if the queue gets unpaused during the obliteration by another script, the call will fail with the removed items it managed to remove until the failure.
                    </div>
                    <Form.Item name="force" valuePropName="checked">
                        <Checkbox value="1">Force</Checkbox>
                    </Form.Item>
                    <Button danger type="primary" {...saveButtonProps}>Obliterate</Button>
                </Space>
            </Card>
        </Form>
    return null;
}