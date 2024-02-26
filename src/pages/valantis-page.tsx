import React, { useEffect, useRef, useState } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import type { TableColumnsType, TableColumnType } from 'antd';
import { Button, Input, Space, Spin, Table } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';
import { getAllDataInfoThunk, getAllInfoThunk, getDataThunk, searchDataThunk } from '../store/valantis/index';

import valantis from "./valantis.module.css"

interface DataType {
    key: string;
    id: string | number;
    brand: string;
    product: string;
    price: number
}

type DataIndex = keyof DataType;

export const ValantisPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { data, AllDataInfo, allInfoData, isLoading, isAllDataInfoLoading,
        isAllInfoLoading, isSearchDaraLoading } = useAppSelector((state: any) => state.valantisSlice)
    const [searchText, setSearchText] = useState<string>('');
    const [searchedColumn, setSearchedColumn] = useState<string>('');
    const searchInput = useRef<any>("");
    const [page, setPage] = useState<number>(1);
    const [isShow, setIsShow] = useState<boolean>(false);

    useEffect(() => {
        dispatch(getAllInfoThunk())
        dispatch(getDataThunk(page));
    }, [])


    useEffect(() => {
        data && dispatch(getAllDataInfoThunk(data))
    }, [data])

    const handleSearchData = (column: string) => {
        setIsShow(true)
        dispatch(searchDataThunk({ title: column, value: searchInput.current?.input?.value }))
    }

    const handleSearch = (
        selectedKeys: string[],
        confirm: FilterDropdownProps['confirm'],
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        setIsShow(false)
        data && dispatch(getAllDataInfoThunk(data))
        clearFilters();
        setSearchText('');
    };

    const handlePaginationChang = (page: number) => {
        setPage(page)
        dispatch(getDataThunk(page));
        dispatch(getAllInfoThunk())
    }

    const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<DataType> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}

                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"

                        onClick={() => { setSearchedColumn(dataIndex), handleSearchData(dataIndex) }}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => {
                            if (clearFilters) {
                                handleReset(clearFilters);
                                close();
                            }
                        }}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),

        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text?.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns: TableColumnsType<DataType> = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            width: '30%',
            ...getColumnSearchProps('id'),
        },
        {
            title: 'Название',
            dataIndex: 'product',
            key: 'product',
            width: '20%',
            ...getColumnSearchProps('product'),
        },
        {
            title: 'Цена ',
            dataIndex: 'price',
            key: 'price',
            ...getColumnSearchProps('price'),
        },
        {
            title: 'Бренд',
            dataIndex: 'brand',
            key: 'brand',
            ...getColumnSearchProps('brand'),
        },
    ];

    return <>

        {
            (isLoading ||
                isAllDataInfoLoading ||
                isAllInfoLoading ||
                isSearchDaraLoading) && <div className={valantis.spin_container}>
                <Spin size='large' className={valantis.spin} />
            </div>
        }
        <Table
            columns={columns}
            dataSource={AllDataInfo}
            pagination={{
                pageSize: 50,
                total: (isShow ? AllDataInfo?.length : allInfoData?.result?.length),
                showSizeChanger: false,
                showQuickJumper: false,
                showTotal: (total, range) => `${range[0]} - ${range[1]} of ${total} items`,
                onChange: handlePaginationChang
            }}
        />;
    </>
};

