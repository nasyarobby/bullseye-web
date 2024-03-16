import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import { IResourceComponentsProps } from "@refinedev/core";
import { Button, Form, Input, Select, Space } from "antd";

export const QueueEdit: React.FC<IResourceComponentsProps> = () => {
    const { formProps, saveButtonProps, formLoading } = useForm({

    });
    const { selectProps: connRedisSelectProps } = useSelect({
        resource: "connections",
        dataProviderName: "connections",
        optionLabel: 'friendlyName'
    });
    return (
        <Edit saveButtonProps={saveButtonProps} isLoading={formLoading} dataProviderName="queues" resource="queue">
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label={"ID"}
                    name={["id"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={"Queue Name"}
                    name={["queueName"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={"Connection"}
                    name={["connectionId"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select {...connRedisSelectProps} />
                </Form.Item>

                <Form.List name="dataFields">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'columnName']}
                                        rules={[{ required: true, message: 'Missing column name' }]}
                                    >
                                        <Input placeholder="Column name" />
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'jsonPath']}
                                        rules={[{ required: true, message: 'Missing JSON path' }]}
                                    >
                                        <Input placeholder="Property" />
                                    </Form.Item>
                                    <MinusCircleOutlined onClick={() => remove(name)} />
                                </Space>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    Add Column
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Form>
        </Edit>
    );
};
