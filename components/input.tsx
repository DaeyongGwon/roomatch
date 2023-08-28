import { AudioOutlined } from '@ant-design/icons';
import React from 'react';
import { Input, Space } from 'antd';

const { Search } = Input;

const suffix = (
    <AudioOutlined
        style={{
            fontSize: 16,
            color: '#1677ff',
        }}
    />
);

const onSearch = (value: string) => console.log(value);

const InputList: React.FC = () => (
    <Space direction="vertical">
        <Search placeholder="input search text" onSearch={onSearch} style={{ width: 200 }} />
        <Search placeholder="input search text" allowClear onSearch={onSearch} style={{ width: 200 }} />
        <Search
            addonBefore="https://"
            placeholder="input search text"
            allowClear
            onSearch={onSearch}
            style={{ width: 304 }}
        />
        <Search placeholder="input search text" onSearch={onSearch} enterButton />
        <Search placeholder="input search text" allowClear enterButton="Search" size="large" onSearch={onSearch} />
        <Search placeholder="input search text" enterButton="Search" size="large" suffix={suffix} onSearch={onSearch} />
    </Space>
);

export default InputList;
