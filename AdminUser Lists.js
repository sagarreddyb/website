import React, {useEffect, useMemo, useState} from "react";
import DataTable from 'react-data-table-component';
import {TextField, Button} from "@material-ui/core";
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import memoize from 'memoize-one';
import CustomLoader from "../../common/CustomLoader";

const useStyles = makeStyles({
    buttonposition:{
        position: 'absolute',
        bottom: '52px',
        width: '100%'
    }
})

const FilterComponent = ({filterText, onFilter, onClear}) => (
    <div style={{display:'flex',flexDirection:'row'}}>
        <TextField id="search" type="text" placeholder="Search by name" value={filterText} onChange={onFilter}/>
        <ClearIcon onClick={onClear}/>
    </div>
);
const columns = memoize(onEdit => [
    {
        name: 'First Name',
        selector: 'firstName',
        sortable: true,
        wrap: true
    },
    {
        name: 'Last Name',
        selector: 'lastName',
        sortable: true,
        wrap: true
    },
    {
        name: 'Email',
        selector: 'email',
        sortable: true,
        wrap: true,
    },
    {
        name: 'Mobile',
        selector: 'mobile',
        sortable: true,
        wrap: true
    },
    {
        name: 'User Type',
        selector: 'userType',
        sortable: true,
        wrap: true
    },
    {
        cell: (row) => <Button variant="contained" color="primary" onClick={() => {
            onEdit(row)
        }}>EDIT</Button>,
        button: true,
    },
]);

const SubHeaderComponentMemo = ({handleClear,filterText,buttonClick,filterTextset}) => {
    const classes = useStyles();

    return (<div style={{display:'flex',flexDirection:'column',position:'relative'}}><Button variant="contained" color="primary" className={classes.buttonposition} onClick={() => {buttonClick()
    }} ><AddIcon/> &nbsp;Add Admin User</Button><FilterComponent onFilter={filterTextset} onClear={handleClear}
                            filterText={filterText}/></div>);
};

const AdminUserList = ({data, onEdit, loading, buttonClick}) => {
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const filteredItems = data.filter(item => item.firstName && item.lastName && (item.firstName + item.lastName).toLowerCase().includes(filterText.toLowerCase())).sort((a,b)=>(Number(b.createdTime||0) - Number(a.createdTime||0))).sort((a,b)=>(Number(b.updatedTime||0) - Number(a.updatedTime||0)));
    const handleClear = () => {
        if (filterText) {
            setResetPaginationToggle(!resetPaginationToggle);
            setFilterText('');
        }
    };
    const filterTextset = (e) => {
        setFilterText(e.target.value)
    }
    // const subHeaderComponentMemo = useMemo(() => {


    //     return (<div style={{display:'flex',flexDirection:'column',position:'relative'}}><Button variant="contained" color="primary" className={classes.buttonposition} onClick={() => {buttonClick()
    //     }} ><AddIcon/> &nbsp;Add Admin User</Button><FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear}
    //                             filterText={filterText}/></div>);
    // }, [filterText, resetPaginationToggle]);
    return (
        <DataTable
            style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'left'
            }}
            title="User List"
            columns={columns(onEdit)}
            data={filteredItems}
            progressPending={loading}
            progressComponent={<CustomLoader />}
            noDataComponent={<p style={{
                fontSize: '1.5rem',
                margin: '20px'
            }}>No records found.</p>}
            pagination
            paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
            subHeader
            subHeaderComponent={<SubHeaderComponentMemo {...{handleClear,filterTextset,buttonClick,filterText}}/>}
            persistTableHead
        />
    );
};

export default AdminUserList
