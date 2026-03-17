// import React, { useContext, useState, useRef } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { ThemeContext } from '../context/ThemeContext';
// import ClearIcon from '@mui/icons-material/Clear';
// import IconButton from '@mui/material/IconButton';
// import { TextField, Typography } from '@mui/material';
// import { useEffect } from 'react';
// import { City, Country, State } from "country-state-city";
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';
// import { Box, Button, Menu } from '@mui/material';
// import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
// import { DatePicker } from '@mui/x-date-pickers/DatePicker'
// import dayjs from 'dayjs';
// import { GET, POST, DELETE } from '../api';
// // import AddRoundedIcon from '@mui/icons-material/AddRounded';
// // import zIndex from '@mui/material/styles/zIndex';
// import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
// import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded';
// import toast from 'react-hot-toast';

// const Navbar = () => {

//   let TokenExist = false;
//   if (window.localStorage.getItem('token')) {
//     TokenExist = true;
//   }



//   const handleCountryChange = (event) => {
//     const selectedCountry = event.target.value;
//     setCountry(selectedCountry);  // Store selected country object
//     setCountryCode(selectedCountry.isoCode);  // Extract and store ISO code
//   };


//   const [anchorEl, setAnchorEl] = React.useState(null);
//   const [anchorElAddBox, setAnchorElAddBox] = React.useState(null);

//   const open = Boolean(anchorEl);
//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };
//   const handleClose = () => {
//     setAnchorEl(null);
//     setCountry("");
//     setState("");
//     setCity("");
//   }


//   let countryData = Country.getAllCountries();
//   // console.log(countryData);

//   const [stateData, setStateData] = useState("");
//   const [cityData, setCityData] = useState("");

//   const [country, setCountry] = useState("");
//   const [countryCode, setCountryCode] = useState("");
//   const [state, setState] = useState("");
//   const [city, setCity] = useState("");


//   const { mode } = useContext(ThemeContext);
//   const [searchQuery, setSearchQuery] = useState('');
//   const navigate = useNavigate();
//   const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
//   const [advancedParams, setAdvancedParams] = useState({
//     site: '',
//     tbs: '',
//   });

//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const safeDayjs = (date) => (date ? dayjs(date) : null)
//   const [isAdvancedSearchDisabled, setIsAdvancedSearchDisabled] = useState(false);
//   const advancedSearchButtonRef = useRef(null);
//   const addBoxRef = React.useRef(null);
//   React.useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (addBoxRef.current && !addBoxRef.current.contains(event.target)) {
//         setShowAddBox(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   useEffect(() => {



//     if ((startDate && !endDate) || (!startDate && endDate)) {
//       setIsAdvancedSearchDisabled(true);
//       return;
//     }
//     const isInvalid =
//       (startDate && endDate && dayjs(startDate).isAfter(endDate)) || // Start date > End date
//       (endDate && dayjs(endDate).isAfter(dayjs())); // End date > Current date

//     setIsAdvancedSearchDisabled(isInvalid);
//   }, [startDate, endDate]);


//   useEffect(() => {
//     setStateData(State.getStatesOfCountry(country?.isoCode));
//     setCityData("");
//   }, [country]);

//   useEffect(() => {
//     setCityData(City.getCitiesOfState(country?.isoCode, state?.isoCode));
//   }, [state, country]);

//   useEffect(() => {
//     stateData && setState("");
//   }, [stateData]);

//   useEffect(() => {
//     cityData && setCity("");
//   }, [cityData]);



//   const handleLogout = () => {
//     window.localStorage.removeItem('token');
//     navigate('/login'); return;
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
//     }
//   };

//   const handleAdvancedSearch = (e) => {
//     // e.preventDefault();
//     console.log('Advanced Search:', searchQuery, advancedParams);
//     console.log('Start Date:', startDate);
//     let site = "";
//     let tbs = "";

//     if (advancedParams.site) {
//       site = `&site=${encodeURIComponent(advancedParams.site)}`;
//     }

//     if (startDate && endDate) {
//       tbs = `&tbs=cdr:1,cd_min:${startDate.$M + 1}/${startDate.$D}/${startDate.$y},cd_max:${endDate.$M + 1}/${endDate.$D}/${endDate.$y}`;
//     }

//     setAdvancedSearchOpen(false);
//     navigate(`/search?q=${encodeURIComponent(searchQuery)}${site}${tbs}`);
//   };

//   // Get the position of the advanced search button
//   const getAdvancedSearchBoxStyle = () => {
//     if (advancedSearchButtonRef.current) {
//       const rect = advancedSearchButtonRef.current.getBoundingClientRect();
//       return {
//         position: 'absolute',
//         top: `${rect.bottom + window.scrollY + 9.02}px`,
//         left: `${rect.left + window.scrollX - 87}px`,
//         backgroundColor: mode === 'light' ? '#ddd5d5' : '#595353',
//         padding: '20px',
//         boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
//         zIndex: 999999999,
//         width: '300px',  // You can adjust the width of the box here
//       };
//     }
//     return {};
//   };

//   const navbarStyle = {
//     position: 'relative',
//     backgroundColor: mode === 'dark' ? '#f0f0f0' : '#464646',
//     backdropFilter: "blur(10px)",
//     paddingLeft: '20px',
//   };

//   const afterStyle = {
//     content: '""',
//     position: 'absolute',
//     top: 0,
//     right: 0,
//     width: '20%',
//     height: '100%',
//     zIndex: -1,
//   };



//   const [quickSearchText, setQuickSearchText] = useState(['']);
//   const [newQuickSearch, setNewQuickSearch] = useState('');
//   const [showAddBox, setShowAddBox] = useState(false);


//   useEffect(() => {

//     const respose = GET('/api/quicksearch/get');
//     respose.then((response) => {

//       if (response.data?.success)
//         setQuickSearchText(response.data.quickSearchText);
//       // else if (response.data?.caught) {
//       //   navigate('/login'); return;
//       //   toast.error(response.data?.message);
//       // }
//     }).catch((error) => {
//       console.error('Error fetching quick search data:', error);
//     });
//   }, [navigate]);


//   const handleAddQuickSearch = () => {

//     console.log(newQuickSearch);

//     const response = POST('/api/quicksearch/add', { quickSearchTextFromFrontend: newQuickSearch });
//     response.then((response) => {

//       console.log(response.data);
//       if (response.data?.caught) {
//         navigate('/login'); return;
//         // toast.error(response.data?.message);
//       }
//       else if (response.data?.success) {
//         setQuickSearchText([...quickSearchText, newQuickSearch]);
//         setNewQuickSearch('');
//         setShowAddBox(false);
//       }
//     }).catch((error) => {
//       console.error('Error adding quick search:', error);
//     });
//   };


//   const handleRightClick = async (e, textToRemove) => {
//     e.preventDefault();
//     const confirmed = window.confirm(`Do you want to remove "${textToRemove}"?`);
//     if (confirmed) {

//       const response = await POST('/api/quicksearch/delete', { quickSearchText: textToRemove });
//       try {
//         if (response.data?.caught) {
//           navigate('/login'); return;
//           // toast.error(response.data?.message);
//         }
//         else if (response.data?.success) {
//           setQuickSearchText(quickSearchText.filter(text => text !== textToRemove)); // Remove the button from UI
//           toast.success(response.data?.message);
//         }
//         else {
//           toast.error(response.data?.message);
//         }
//       }
//       catch (error) {
//         toast.error('Error deleting quick search');
//       }
//     }
//   };


//   const [anchorEl_, setAnchorEl_] = React.useState(null);
//   const open_ = Boolean(anchorEl_);
//   const handleClick_ = (event) => {
//     setAnchorEl_(event.currentTarget);
//   };

//   const handleClose_ = () => {
//     setAnchorEl_(null);
//   };




//   return (
//     <>
//       <nav className="navbar navbar-expand-lg" style={navbarStyle}>
//         <div className="container-fluid">
//           <Link className={`navbar-brand ${mode === 'dark' ? 'text-dark' : 'text-light'}`} to="/">News Aggregator</Link>

//           <div className="collapse navbar-collapse justify-content-between" id="navbarSupportedContent">
//             <ul className="navbar-nav me-auto mb-2 mb-lg-0">
//               <li className="nav-item">
//                 <Link className={`nav-link active ${mode === 'dark' ? 'text-dark' : 'text-light'}`} aria-current="page" to="/">Home</Link>
//               </li>
//               <li className="nav-item">
//                 <Link className={`nav-link ${mode === 'dark' ? 'text-dark' : 'text-light'}`} to="/providers/all">Providers</Link>
//               </li>
//             </ul>

//             {TokenExist && (<>
//               <div>
//                 <div className="d-flex mx-auto" style={{ flexGrow: 1, justifyContent: 'center' }}>
//                   <input
//                     className="form-control me-2"
//                     type="search"
//                     placeholder="Search for topics"
//                     aria-label="Search"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     style={{ maxWidth: '300px' }}
//                   />

//                   <div className="btn-group">
//                     <Button
//                       variant="contained"
//                       size="small"
//                       sx={{
//                         backgroundColor: 'lightgreen',
//                         borderRadius: '8px 0 0 8px',
//                         padding: '8px 16px',
//                         border: '1px solid green',
//                         boxShadow: 'none', // Remove any shadow
//                         '&:hover': {
//                           backgroundColor: 'rgb(116, 200, 116)',
//                           boxShadow: 'none', // Ensure no shadow on hover
//                         },
//                         transition: 'background-color 0.3s ease', // Smooth color transition
//                         color: "black"
//                       }}
//                       onClick={handleSearch}
//                     >
//                       Search
//                     </Button>

//                   </div>
//                   <div>
//                     <IconButton
//                       id="demo-customized-button"
//                       aria-controls={open_ ? 'demo-customized-menu' : undefined}
//                       aria-haspopup="true"
//                       aria-expanded={open_ ? 'true' : undefined}
//                       variant="outlined"
//                       sx={{
//                         backgroundColor: 'lightgreen',
//                         borderRadius: '0 8px 8px 0', // Rounded corners for right side
//                         padding: '8px', // Ensure padding matches the Search button
//                         margin: 0, // Remove extra margin
//                         border: '1px solid green', // Consistent border with Search button
//                         minWidth: 0, // Adjust to fit icon properly
//                         '&:hover': {
//                           backgroundColor: 'rgb(116, 200, 116)',
//                         },
//                         color: "black"
//                       }}
//                       onClick={handleClick_}
//                     >

//                       <ExpandMoreRoundedIcon />
//                     </IconButton>
//                     <Menu
//                       id="basic-menu"
//                       anchorEl={anchorEl_}
//                       open={open_}
//                       onClose={handleClose_}
//                       MenuListProps={{
//                         'aria-labelledby': 'basic-button',
//                       }}
//                       anchorOrigin={{
//                         vertical: 'bottom', // Align the bottom of the menu with the button
//                         horizontal: 'center', // Align the left side of the menu with the button
//                       }}
//                       transformOrigin={{
//                         vertical: 'top', // Align the top of the menu with the button
//                         horizontal: 'center', // Align the right side of the menu with the button
//                       }}
//                     >
//                       <Box sx={{ p: 2 }}>
//                         <Typography fontWeight="bold" fontSize="x-large" sx={{ fontFamily: "Quicksand", width: "100%", textAlign: "center", pb: 2 }}>
//                           Advanced Search
//                         </Typography>
//                         {/* Site Input Section */}
//                         <Box
//                           sx={{
//                             marginBottom: '10px',
//                             padding: '12px',
//                             borderRadius: '8px',
//                             backgroundColor: mode === 'light' ? '#f8f9fa' : '#343a40',
//                             border: `1px solid ${mode === 'light' ? '#ced4da' : '#495057'}`,
//                             textAlign: 'center',
//                           }}
//                         >
//                           <label
//                             htmlFor="site"
//                             className="form-label"
//                             style={{ color: mode === 'light' ? 'black' : 'white' }}
//                           >
//                             Site
//                           </label>
//                           <input
//                             type="text"
//                             id="site"
//                             value={advancedParams.site}
//                             onChange={(e) => setAdvancedParams({ ...advancedParams, site: e.target.value })}
//                             style={{
//                               border: '1px solid',
//                               borderColor: mode === 'light' ? '#ced4da' : '#495057',
//                               borderRadius: '4px',
//                               padding: '8px',
//                               width: '100%', // Keep input width at 100%
//                               boxSizing: 'border-box',
//                               color: mode === 'light' ? 'black' : 'white', // Input text color
//                               backgroundColor: mode === 'light' ? '#fff' : '#495057', // Input background color
//                             }}
//                             // Placeholder color styling
//                             placeholder="Enter site"
//                             className={`placeholder-${mode === 'dark' ? 'dark' : 'light'} form-control`}
//                           />
//                           <style>
//                             {`
//         .placeholder-dark::placeholder {
//           color: #bbb; /* Date range text color in dark mode */
//         }
//         .placeholder-light::placeholder {
//           color: #888; /* Placeholder color in light mode */
//         }
//       `}
//                           </style>
//                         </Box>

//                         <Box
//                           sx={{
//                             padding: '12px',
//                             borderRadius: '8px',
//                             backgroundColor: mode === 'light' ? '#f8f9fa' : '#343a40',
//                             border: `1px solid ${mode === 'light' ? '#ced4da' : '#495057'}`,
//                             display: 'flex',
//                             flexDirection: 'column',
//                             gap: '8px',
//                           }}
//                         >
//                           <Typography
//                             variant="h6"
//                             sx={{ color: mode === 'light' ? 'black' : 'white', fontSize: '1rem', textAlign: 'center' }}
//                           >
//                             Date Range
//                           </Typography>

//                           <LocalizationProvider dateAdapter={AdapterDayjs}>
//                             {/* Start Date Picker */}
//                             <DatePicker
//                               label="Start Date"
//                               value={startDate}
//                               maxDate={safeDayjs(endDate) || dayjs()}
//                               onChange={(newValue) => setStartDate(newValue)}
//                               slots={{ textField: TextField }}
//                               slotProps={{ textField: { fullWidth: true } }}
//                             />

//                             {/* End Date Picker */}
//                             <DatePicker
//                               label="End Date"
//                               value={endDate}
//                               minDate={safeDayjs(startDate)}
//                               maxDate={dayjs()}
//                               onChange={(newValue) => setEndDate(newValue)}
//                               slots={{ textField: TextField }}
//                               slotProps={{ textField: { fullWidth: true, inputProps: { readOnly: true } } }}
//                             />
//                           </LocalizationProvider>
//                         </Box>
//                         <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", pt: 2, width: "100%" }}>
//                           <Button
//                             onClick={() => { handleAdvancedSearch(); handleClose_(); }}
//                             variant="contained"
//                             color="primary"
//                           >
//                             Advanced Search
//                           </Button>
//                         </Box>
//                       </Box>
//                     </Menu>
//                   </div>
//                 </div>


//                 {advancedSearchOpen && (

//                   <div style={{ ...getAdvancedSearchBoxStyle(), zIndex: 999999999, }} onClick={(e) => { e.stopPropagation(); }}>
//                     <h3 style={{ color: mode === 'light' ? 'black' : 'white', textAlign: "center" }}> Advanced Search</h3>
//                     <IconButton
//                       style={{ position: 'absolute', top: '0px', right: '0px' }}
//                       onClick={() => setAdvancedSearchOpen(false)}
//                     >
//                       <ClearIcon onClick={() => setAdvancedSearchOpen(false)} />
//                     </IconButton>



//                     <form
//                       onSubmit={handleAdvancedSearch}
//                       style={{
//                         padding: '20px',
//                         borderRadius: '8px',
//                         boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//                         backgroundColor: mode === 'light' ? '#ffffff' : '#495057',
//                         color: mode === 'light' ? 'black' : 'white',
//                         maxWidth: '800px', // Increase maximum width for the form
//                         margin: '0 auto', // Center the form horizontally
//                       }}
//                     >
//                       {/* Site Input Section */}
//                       <Box
//                         sx={{
//                           marginBottom: '10px',
//                           padding: '12px',
//                           borderRadius: '8px',
//                           backgroundColor: mode === 'light' ? '#f8f9fa' : '#343a40',
//                           border: `1px solid ${mode === 'light' ? '#ced4da' : '#495057'}`,
//                           textAlign: 'center',
//                         }}
//                       >
//                         <label
//                           htmlFor="site"
//                           className="form-label"
//                           style={{ color: mode === 'light' ? 'black' : 'white' }}
//                         >
//                           Site
//                         </label>
//                         <input
//                           type="text"
//                           id="site"
//                           value={advancedParams.site}
//                           onChange={(e) => setAdvancedParams({ ...advancedParams, site: e.target.value })}
//                           style={{
//                             border: '1px solid',
//                             borderColor: mode === 'light' ? '#ced4da' : '#495057',
//                             borderRadius: '4px',
//                             padding: '8px',
//                             width: '100%', // Keep input width at 100%
//                             boxSizing: 'border-box',
//                             color: mode === 'light' ? 'black' : 'white', // Input text color
//                             backgroundColor: mode === 'light' ? '#fff' : '#495057', // Input background color
//                           }}
//                           // Placeholder color styling
//                           placeholder="Enter site"
//                           className={`placeholder-${mode === 'dark' ? 'dark' : 'light'} form-control`}
//                         />
//                         <style>
//                           {`
//         .placeholder-dark::placeholder {
//           color: #bbb; /* Date range text color in dark mode */
//         }
//         .placeholder-light::placeholder {
//           color: #888; /* Placeholder color in light mode */
//         }
//       `}
//                         </style>
//                       </Box>

//                       {/* Date Range Section */}
//                       <Box
//                         sx={{
//                           padding: '12px',
//                           borderRadius: '8px',
//                           backgroundColor: mode === 'light' ? '#f8f9fa' : '#343a40',
//                           border: `1px solid ${mode === 'light' ? '#ced4da' : '#495057'}`,
//                           display: 'flex',
//                           flexDirection: 'column',
//                           gap: '8px',
//                         }}
//                       >
//                         <Typography
//                           variant="h6"
//                           sx={{ color: mode === 'light' ? 'black' : 'white', fontSize: '1rem', textAlign: 'center' }}
//                         >
//                           Date Range
//                         </Typography>

//                         <LocalizationProvider dateAdapter={AdapterDayjs}>
//                           {/* Start Date Picker */}
//                           <DatePicker
//                             label="Start Date"
//                             value={startDate}
//                             maxDate={safeDayjs(endDate) || dayjs()}
//                             onChange={(newValue) => setStartDate(newValue)}
//                             slots={{ textField: TextField }}
//                             slotProps={{ textField: { fullWidth: true } }}
//                           />

//                           {/* End Date Picker */}
//                           <DatePicker
//                             label="End Date"
//                             value={endDate}
//                             minDate={safeDayjs(startDate)}
//                             maxDate={dayjs()}
//                             onChange={(newValue) => setEndDate(newValue)}
//                             slots={{ textField: TextField }}
//                             slotProps={{ textField: { fullWidth: true, inputProps: { readOnly: true } } }}
//                           />
//                         </LocalizationProvider>
//                       </Box>

//                       <Button
//                         type="submit"
//                         variant="contained"
//                         color="primary"
//                         disabled={isAdvancedSearchDisabled}
//                         sx={{
//                           padding: '10px 20px',
//                           textAlign: 'center',
//                           justifyContent: 'center',
//                           display: 'flex',
//                           margin: '12px auto 0',
//                           width: '80%', // Width for the button
//                           borderRadius: '4px',
//                           backgroundColor: isAdvancedSearchDisabled ? '#ced4da' : '#007bff',
//                           color: 'white',
//                           fontWeight: 'bold',
//                           marginBottom: '-10px',
//                         }}
//                       >
//                         Advanced Search
//                       </Button>
//                     </form>

//                   </div>
//                 )}
//               </div>
//             </>)}

//             <form className="d-flex mx-5">
//               {TokenExist ? (
//                 <button className="btn btn-danger mx-1" onClick={handleLogout}>Logout</button>
//               ) : (
//                 <>
//                   <Link className="btn btn-primary mx-1" to="/login" role="button">Login</Link>
//                   <Link className="btn btn-primary mx-1" to="/signup" role="button">Signup</Link>
//                 </>
//               )}
//             </form>
//           </div>
//         </div >
//         <div style={afterStyle}></div>
//       </nav >



//       {TokenExist && <Box
//         sx={{
//           fontFamily: "Quicksand",
//           display: 'flex',
//           justifyContent: 'flex-start',
//           alignItems: 'center',
//           padding: '10px 0',
//           overflowX: 'auto', // Handles overflow on small screens
//           backgroundColor: mode === 'dark' ? '#464646' : 'rgb(230, 230, 230)', // Background color for both modes
//           color: mode === 'dark' ? '#fff' : '#000', // Text color for both modes
//           zIndex: 1,
//           marginLeft: '20px',
//         }}
//       >
//         <div>
//           <Button
//             id="basic-button"
//             aria-controls={open ? 'basic-menu' : undefined}
//             aria-haspopup="true"
//             aria-expanded={open ? 'true' : undefined}
//             onClick={handleClick}
//             endIcon={<KeyboardArrowDownRoundedIcon />}
//             color='error'
//             sx={{
//               fontWeight: 'bold',
//               fontSize: 'large',
//               fontFamily: "Quicksand",
//               color: mode === 'dark' ? 'rgb(255, 255, 255)' : '#000', // Button text color for both modes
//               backgroundColor: mode === 'dark' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)', // Button background color for both modes
//               m: 0.3,

//             }}
//           >
//             Global
//           </Button>
//           <Menu
//             id="basic-menu"
//             anchorEl={anchorEl}
//             open={open}
//             onClose={handleClose}
//             sx={{ p: 0 }}
//             MenuListProps={{
//               'aria-labelledby': 'basic-button',
//             }}
//           >
//             <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//               <InputLabel id="demo-simple-select-filled-label">Country</InputLabel>
//               <Select
//                 labelId="demo-simple-select-filled-label"
//                 id="demo-simple-select-filled"
//                 value={country}
//                 onChange={handleCountryChange}
//               >
//                 {countryData && countryData.map((country, index) => (
//                   <MenuItem key={index} value={country}>{country.name}</MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//             <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//               <InputLabel id="demo-simple-select-filled-label">State</InputLabel>
//               <Select
//                 labelId="demo-simple-select-filled-label"
//                 id="demo-simple-select-filled"
//                 value={state}
//                 onChange={(e) => { setState(e.target.value) }}
//               >
//                 {stateData && stateData.map((state, index) => (
//                   <MenuItem key={index} value={state}>{state.name}</MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//             <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//               <InputLabel id="demo-simple-select-filled-label">City</InputLabel>
//               <Select
//                 labelId="demo-simple-select-filled-label"
//                 id="demo-simple-select-filled"
//                 value={city}
//                 onChange={(e) => { setCity(e.target.value) }}
//               >
//                 {cityData && cityData.map((city, index) => (
//                   <MenuItem key={index} value={city}>{city.name}</MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//             <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={() => {
//                   // Add your search logic here
//                   console.log('Search button clicked');
//                   navigate(`/search?gl=${countryCode}&location=${city.name ? city.name : state.name ? state.name : ""}`);
//                 }}
//                 sx={{ fontWeight: "bold", fontSize: "large", borderRadius: 2, m: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '80%' }}
//                 endIcon={<TravelExploreRoundedIcon fontSize='large' />}

//               >
//                 Localized News
//               </Button>
//             </div>
//           </Menu>
//         </div>


//         {quickSearchText?.map((text, index) => (
//           <div key={index}>
//             <Button
//               onClick={() => navigate(`/search?q=${encodeURIComponent(text)}`)}
//               onContextMenu={(e) => handleRightClick(e, text)} // Right-click event to show remove option
//               sx={{
//                 fontSize: 'large',
//                 fontFamily: "Quicksand",
//                 color: mode === 'dark' ? '#fff' : '#000',
//                 boxShadow: 3, // Add some shadow for better visibility
//                 borderRadius: 1, // Rounded corners
//                 zIndex: 2,
//                 backgroundColor: mode === 'dark' ? '#333' : '#f5f5f5', // Background color for both modes
//                 border: `1px solid ${mode === 'dark' ? '#000000' : '#ffffff'}`, // Border for better visibility
//                 m: 0.3,
//               }}
//             >
//               {text}
//             </Button>
//           </div>
//         ))}

//         <div style={{ marginLeft: 'auto' }}>
//           <Button
//             id="add-box-button"
//             aria-controls={showAddBox ? 'add-box-menu' : undefined}
//             aria-haspopup="true"
//             aria-expanded={showAddBox ? 'true' : undefined}
//             onClick={(e) => {
//               setAnchorElAddBox(e.currentTarget); // Track the button's position
//               setShowAddBox(!showAddBox); // Toggle the Add Box
//             }}
//             endIcon={<KeyboardArrowDownRoundedIcon />}
//             color="error"
//             sx={{
//               mr: 2,
//               fontWeight: 'bold',
//               fontSize: 'large',
//               fontFamily: 'Quicksand',
//               color: mode === 'dark' ? 'rgb(255, 255, 255)' : '#000',
//               display: advancedSearchOpen ? 'none' : 'flex',
//             }}
//           >
//             add topic
//           </Button>

//           <Menu
//             id="add-box-menu"
//             anchorEl={anchorElAddBox}
//             open={showAddBox}
//             onClose={() => setShowAddBox(false)}
//             sx={{
//               mt: 1.4,
//               ml: -1, // Shift the box slightly to the left
//               '& .MuiPaper-root': {
//                 bgcolor: mode === 'dark' ? '#424242' : '#fff',
//                 boxShadow: 3,
//                 borderRadius: 1,
//               },
//             }}
//             MenuListProps={{
//               'aria-labelledby': 'add-box-button',
//             }}
//           >
//             <Box
//               sx={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 gap: 1,
//                 minWidth: '200px',
//                 p: 1,
//               }}
//             >
//               <TextField
//                 value={newQuickSearch}
//                 onChange={(e) => setNewQuickSearch(e.target.value)}
//                 placeholder="Topic Name"
//                 size="small"
//                 sx={{
//                   '& .MuiInputBase-root': {
//                     color: mode === 'dark' ? '#fff' : '#000',
//                     bgcolor: mode === 'dark' ? '#333' : '#f5f5f5',
//                   },
//                 }}
//               />
//               <Button
//                 onClick={() => {
//                   handleAddQuickSearch(newQuickSearch);
//                   setNewQuickSearch('');
//                   setShowAddBox(false);
//                 }}
//                 variant="contained"
//                 sx={{
//                   fontFamily: 'Quicksand',
//                   width: '100%',
//                 }}
//               >
//                 Add
//               </Button>
//             </Box>
//           </Menu>
//         </div>


//       </Box >}


//     </>
//   );
// };

// export default Navbar;


import React, { useContext, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import IconButton from '@mui/material/IconButton';
import { TextField, Typography } from '@mui/material';
import { useEffect } from 'react';
import { City, Country, State } from "country-state-city";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Box, Button, Menu, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs';
import { GET, POST } from '../api';
// import AddRoundedIcon from '@mui/icons-material/AddRounded';
// import zIndex from '@mui/material/styles/zIndex';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import Tooltip from '@mui/material/Tooltip';
import toast from 'react-hot-toast';
import Logo from './Logo';

const Navbar = () => {

  let TokenExist = false;
  if (window.localStorage.getItem('token')) {
    TokenExist = true;
  }



  const handleCountryChange = (event) => {
    const selectedCountry = event.target.value;
    setCountry(selectedCountry);  // Store selected country object
    setCountryCode(selectedCountry.isoCode);  // Extract and store ISO code
  };


  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [topicToRemove, setTopicToRemove] = useState('');

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElAddBox, setAnchorElAddBox] = React.useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setCountry("");
    setState("");
    setCity("");
  }


  let countryData = Country.getAllCountries();
  // console.log(countryData);

  const [stateData, setStateData] = useState("");
  const [cityData, setCityData] = useState("");

  const [country, setCountry] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");


  const { mode } = useContext(ThemeContext);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
  const [advancedParams, setAdvancedParams] = useState({
    site: '',
    tbs: '',
  });

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const safeDayjs = (date) => (date ? dayjs(date) : null)
  const [isAdvancedSearchDisabled, setIsAdvancedSearchDisabled] = useState(false);
  const advancedSearchButtonRef = useRef(null);
  const addBoxRef = React.useRef(null);
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (addBoxRef.current && !addBoxRef.current.contains(event.target)) {
        setShowAddBox(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {



    if ((startDate && !endDate) || (!startDate && endDate)) {
      setIsAdvancedSearchDisabled(true);
      return;
    }
    const isInvalid =
      (startDate && endDate && dayjs(startDate).isAfter(endDate)) || // Start date > End date
      (endDate && dayjs(endDate).isAfter(dayjs())); // End date > Current date

    setIsAdvancedSearchDisabled(isInvalid);
  }, [startDate, endDate]);


  useEffect(() => {
    setStateData(State.getStatesOfCountry(country?.isoCode));
    setCityData("");
  }, [country]);

  useEffect(() => {
    setCityData(City.getCitiesOfState(country?.isoCode, state?.isoCode));
  }, [state, country]);

  useEffect(() => {
    stateData && setState("");
  }, [stateData]);

  useEffect(() => {
    cityData && setCity("");
  }, [cityData]);



  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search:', searchQuery);
    console.log(searchQuery.trim());
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleAdvancedSearch = (e) => {
    // e.preventDefault();
    console.log('Advanced Search:', searchQuery, advancedParams);
    console.log('Start Date:', startDate);
    let site = "";
    let tbs = "";

    if (advancedParams.site) {
      site = `&site=${encodeURIComponent(advancedParams.site)}`;
    }

    if (startDate && endDate) {
      tbs = `&tbs=cdr:1,cd_min:${startDate.$M + 1}/${startDate.$D}/${startDate.$y},cd_max:${endDate.$M + 1}/${endDate.$D}/${endDate.$y}`;
    }

    setAdvancedSearchOpen(false);
    navigate(`/search?q=${encodeURIComponent(searchQuery)}${site}${tbs}`);
  };

  // Get the position of the advanced search button
  const getAdvancedSearchBoxStyle = () => {
    if (advancedSearchButtonRef.current) {
      const rect = advancedSearchButtonRef.current.getBoundingClientRect();
      return {
        position: 'absolute',
        top: `${rect.bottom + window.scrollY + 9.02}px`,
        left: `${rect.left + window.scrollX - 87}px`,
        backgroundColor: mode === 'light' ? '#ddd5d5' : '#595353',
        padding: '20px',
        boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
        zIndex: 999999999,
        width: '300px',  // You can adjust the width of the box here
      };
    }
    return {};
  };

  const navbarStyle = {
    position: 'relative',
    backgroundColor: mode === 'dark' ? 'rgba(26, 26, 26, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    backdropFilter: "blur(20px)",
    paddingLeft: '20px',
    borderBottom: mode === 'dark' ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
  };

  const afterStyle = {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '20%',
    height: '100%',
    zIndex: -1,
  };



  const [quickSearchText, setQuickSearchText] = useState([]);
  const [newQuickSearch, setNewQuickSearch] = useState('');
  const [showAddBox, setShowAddBox] = useState(false);
  const [quickSearchLoading, setQuickSearchLoading] = useState(true);


  useEffect(() => {

    const respose = GET('/api/quicksearch/get');
    respose.then((response) => {

      if (response.data?.success)
        setQuickSearchText(response.data.quickSearchText);
    }).catch((error) => {
      console.error('Error fetching quick search data:', error);
    }).finally(() => {
      setQuickSearchLoading(false);
    });
  }, [navigate]);


  const handleAddQuickSearch = () => {


    const response = POST('/api/quicksearch/add', { quickSearchTextFromFrontend: newQuickSearch });
    response.then((response) => {

      if (response.data?.caught) {
        navigate('/login'); return;
        // toast.error(response.data?.message);
      }
      else if (response.data?.success) {
        setQuickSearchText([...quickSearchText, newQuickSearch]);
        setNewQuickSearch('');
        setShowAddBox(false);
      }
    }).catch((error) => {
      console.error('Error adding quick search:', error);
    });
  };


  const handleRightClick = (e, textToRemove) => {
    e.preventDefault();
    setTopicToRemove(textToRemove);
    setRemoveDialogOpen(true);
  };

  const handleConfirmRemove = async () => {
    setRemoveDialogOpen(false);
    try {
      const response = await POST('/api/quicksearch/delete', { quickSearchText: topicToRemove });
      if (response.data?.caught) {
        navigate('/login'); return;
      }
      else if (response.data?.success) {
        setQuickSearchText(quickSearchText.filter(text => text !== topicToRemove));
        toast.success(response.data?.message);
      }
      else {
        toast.error(response.data?.message);
      }
    }
    catch (error) {
      console.error('Error deleting quick search:', error);
      toast.error('Error deleting quick search');
    }
    setTopicToRemove('');
  };


  const [anchorEl_, setAnchorEl_] = React.useState(null);
  const open_ = Boolean(anchorEl_);
  const handleClick_ = (event) => {
    setAnchorEl_(event.currentTarget);
  };

  const handleClose_ = () => {
    setAnchorEl_(null);
  };




  return (
    <>
      <nav className="navbar navbar-expand-lg" style={navbarStyle}>
        <div className="container-fluid">
          <Link className={`navbar-brand`} to="/" style={{ textDecoration: 'none' }}>
            <Logo height={52} />
          </Link>


          <div className="collapse navbar-collapse justify-content-between" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  className={`nav-link ${mode === 'dark' ? 'text-light' : 'text-dark'}`}
                  to="/providers/all"
                  style={{ fontSize: '18px', fontFamily: "'Quicksand', sans-serif", fontWeight: 600 }}
                >
                  Providers
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${mode === 'dark' ? 'text-light' : 'text-dark'}`}
                  to="/about"
                  style={{ fontSize: '18px', fontFamily: "'Quicksand', sans-serif", fontWeight: 600 }}
                >
                  About Us
                </Link>
              </li>
            </ul>


            {TokenExist && (<>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', flex: 1, paddingRight: '10px' }}>
                  <Box
                    component="form"
                    onSubmit={handleSearch}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                      borderRadius: '50px',
                      padding: '4px 6px 4px 20px',
                      width: '500px',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      border: '2px solid transparent',
                      '&:focus-within': {
                        width: '600px',
                        backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.15)' : '#fff',
                        border: '2px solid rgb(30, 144, 255)',
                        boxShadow: '0 4px 20px rgba(30, 144, 255, 0.15)',
                      },
                      '&:hover': {
                        backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
                      },
                    }}
                  >
                    <TravelExploreRoundedIcon sx={{ color: mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)', mr: 1, fontSize: '22px' }} />
                    <input
                      type="search"
                      placeholder="Search for news, topics, sources..."
                      aria-label="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        flex: 1,
                        fontSize: '17px',
                        fontFamily: "'Quicksand', sans-serif",
                        fontWeight: 500,
                        color: mode === 'dark' ? '#fff' : '#1a1a2e',
                        padding: '10px 0',
                      }}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        background: 'linear-gradient(135deg, #1e90ff 0%, #0066cc 100%)',
                        borderRadius: '50px',
                        padding: '8px 20px',
                        boxShadow: 'none',
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '16px',
                        fontFamily: "'Quicksand', sans-serif",
                        '&:hover': {
                          background: 'linear-gradient(135deg, #0066cc 0%, #004999 100%)',
                          boxShadow: '0 2px 8px rgba(30, 144, 255, 0.3)',
                        },
                        transition: 'all 0.3s ease',
                        color: '#fff',
                      }}
                      onClick={handleSearch}
                    >
                      Search
                    </Button>
                    <IconButton
                      size="small"
                      sx={{
                        ml: 0.5,
                        color: mode === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.4)',
                        '&:hover': {
                          color: 'rgb(30, 144, 255)',
                          backgroundColor: 'transparent',
                        },
                      }}
                      onClick={handleClick_}
                    >
                      <ExpandMoreRoundedIcon />
                    </IconButton>
                  </Box>
                  <Menu
                      id="basic-menu"
                      anchorEl={anchorEl_}
                      open={open_}
                      onClose={handleClose_}
                      MenuListProps={{
                        'aria-labelledby': 'basic-button',
                      }}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                      }}
                      sx={{
                        mt: 1,
                        '& .MuiPaper-root': {
                          borderRadius: '16px',
                          bgcolor: mode === 'dark' ? '#2a2a2a' : '#fff',
                          boxShadow: mode === 'dark' ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.12)',
                          border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                        },
                      }}
                    >
                      <Box sx={{ p: 2.5 }}>
                        <Typography fontWeight={800} fontSize="1.2rem" sx={{ fontFamily: "Quicksand", width: "100%", textAlign: "center", pb: 2, color: mode === 'dark' ? '#fff' : '#1a1a2e' }}>
                          Advanced Search
                        </Typography>
                        {/* Site Input Section */}
                        <Box
                          sx={{
                            marginBottom: '10px',
                            padding: '12px',
                            borderRadius: '8px',
                            backgroundColor: mode === 'light' ? '#f8f9fa' : '#343a40',
                            border: `1px solid ${mode === 'light' ? '#ced4da' : '#495057'}`,
                            textAlign: 'center',
                          }}
                        >
                          <label
                            htmlFor="site"
                            className="form-label"
                            style={{ color: mode === 'light' ? 'black' : 'white' }}
                          >
                            Site
                          </label>
                          <input
                            type="text"
                            id="site"
                            value={advancedParams.site}
                            onChange={(e) => setAdvancedParams({ ...advancedParams, site: e.target.value })}
                            style={{
                              border: '1px solid',
                              borderColor: mode === 'light' ? '#ced4da' : '#495057',
                              borderRadius: '4px',
                              padding: '8px',
                              width: '100%', // Keep input width at 100%
                              boxSizing: 'border-box',
                              color: mode === 'light' ? 'black' : 'white', // Input text color
                              backgroundColor: mode === 'light' ? '#fff' : '#495057', // Input background color
                            }}
                            // Placeholder color styling
                            placeholder="Enter site"
                            className={`placeholder-${mode === 'dark' ? 'dark' : 'light'} form-control`}
                          />
                          <style>
                            {`
        .placeholder-dark::placeholder {
          color: #bbb; /* Date range text color in dark mode */
        }
        .placeholder-light::placeholder {
          color: #888; /* Placeholder color in light mode */
        }
      `}
                          </style>
                        </Box>

                        <Box
                          sx={{
                            padding: '12px',
                            borderRadius: '8px',
                            backgroundColor: mode === 'light' ? '#f8f9fa' : '#343a40',
                            border: `1px solid ${mode === 'light' ? '#ced4da' : '#495057'}`,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{ color: mode === 'light' ? 'black' : 'white', fontSize: '1rem', textAlign: 'center' }}
                          >
                            Date Range
                          </Typography>

                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            {/* Start Date Picker */}
                            <DatePicker
                              label="Start Date"
                              value={startDate}
                              maxDate={safeDayjs(endDate) || dayjs()}
                              onChange={(newValue) => setStartDate(newValue)}
                              slots={{ textField: TextField }}
                              slotProps={{ textField: { fullWidth: true } }}
                            />

                            {/* End Date Picker */}
                            <DatePicker
                              label="End Date"
                              value={endDate}
                              minDate={safeDayjs(startDate)}
                              maxDate={dayjs()}
                              onChange={(newValue) => setEndDate(newValue)}
                              slots={{ textField: TextField }}
                              slotProps={{ textField: { fullWidth: true, inputProps: { readOnly: true } } }}
                            />
                          </LocalizationProvider>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", pt: 2, width: "100%" }}>
                          <Button
                            onClick={() => { handleAdvancedSearch(); handleClose_(); }}
                            variant="contained"
                            color="primary"
                          >
                            Advanced Search
                          </Button>
                        </Box>
                      </Box>
                    </Menu>


                {advancedSearchOpen && (

                  <div style={{ ...getAdvancedSearchBoxStyle(), zIndex: 999999999, }} onClick={(e) => { e.stopPropagation(); }}>
                    <h3 style={{ color: mode === 'light' ? 'black' : 'white', textAlign: "center" }}> Advanced Search</h3>



                    <form
                      onSubmit={handleAdvancedSearch}
                      style={{
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        backgroundColor: mode === 'light' ? '#ffffff' : '#495057',
                        color: mode === 'light' ? 'black' : 'white',
                        maxWidth: '800px', // Increase maximum width for the form
                        margin: '0 auto', // Center the form horizontally
                      }}
                    >
                      {/* Site Input Section */}
                      <Box
                        sx={{
                          marginBottom: '10px',
                          padding: '12px',
                          borderRadius: '8px',
                          backgroundColor: mode === 'light' ? '#f8f9fa' : '#343a40',
                          border: `1px solid ${mode === 'light' ? '#ced4da' : '#495057'}`,
                          textAlign: 'center',
                        }}
                      >
                        <label
                          htmlFor="site"
                          className="form-label"
                          style={{ color: mode === 'light' ? 'black' : 'white' }}
                        >
                          Site
                        </label>
                        <input
                          type="text"
                          id="site"
                          value={advancedParams.site}
                          onChange={(e) => setAdvancedParams({ ...advancedParams, site: e.target.value })}
                          style={{
                            border: '1px solid',
                            borderColor: mode === 'light' ? '#ced4da' : '#495057',
                            borderRadius: '4px',
                            padding: '8px',
                            width: '100%', // Keep input width at 100%
                            boxSizing: 'border-box',
                            color: mode === 'light' ? 'black' : 'white', // Input text color
                            backgroundColor: mode === 'light' ? '#fff' : '#495057', // Input background color
                          }}
                          // Placeholder color styling
                          placeholder="Enter site"
                          className={`placeholder-${mode === 'dark' ? 'dark' : 'light'} form-control`}
                        />
                        <style>
                          {`
        .placeholder-dark::placeholder {
          color: #bbb; /* Date range text color in dark mode */
        }
        .placeholder-light::placeholder {
          color: #888; /* Placeholder color in light mode */
        }
      `}
                        </style>
                      </Box>

                      {/* Date Range Section */}
                      <Box
                        sx={{
                          padding: '12px',
                          borderRadius: '8px',
                          backgroundColor: mode === 'light' ? '#f8f9fa' : '#343a40',
                          border: `1px solid ${mode === 'light' ? '#ced4da' : '#495057'}`,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ color: mode === 'light' ? 'black' : 'white', fontSize: '1rem', textAlign: 'center' }}
                        >
                          Date Range
                        </Typography>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          {/* Start Date Picker */}
                          <DatePicker
                            label="Start Date"
                            value={startDate}
                            maxDate={safeDayjs(endDate) || dayjs()}
                            onChange={(newValue) => setStartDate(newValue)}
                            slots={{ textField: TextField }}
                            slotProps={{ textField: { fullWidth: true } }}
                          />

                          {/* End Date Picker */}
                          <DatePicker
                            label="End Date"
                            value={endDate}
                            minDate={safeDayjs(startDate)}
                            maxDate={dayjs()}
                            onChange={(newValue) => setEndDate(newValue)}
                            slots={{ textField: TextField }}
                            slotProps={{ textField: { fullWidth: true, inputProps: { readOnly: true } } }}
                          />
                        </LocalizationProvider>
                      </Box>

                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isAdvancedSearchDisabled}
                        sx={{
                          padding: '10px 20px',
                          textAlign: 'center',
                          justifyContent: 'center',
                          display: 'flex',
                          margin: '12px auto 0',
                          width: '80%', // Width for the button
                          borderRadius: '4px',
                          backgroundColor: isAdvancedSearchDisabled ? '#ced4da' : '#007bff',
                          color: 'white',
                          fontWeight: 'bold',
                          marginBottom: '-10px',
                        }}
                      >
                        Advanced Search
                      </Button>
                    </form>

                  </div>
                )}
              </div>
            </>)}

            {!TokenExist && (
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  sx={{
                    fontWeight: 700,
                    fontSize: '15px',
                    borderRadius: '50px',
                    px: 3,
                    py: 0.7,
                    borderWidth: '1.5px',
                    borderColor: mode === 'dark' ? 'rgba(30,144,255,0.4)' : 'rgba(30,144,255,0.5)',
                    color: mode === 'dark' ? '#90CAF9' : '#1E90FF',
                    '&:hover': {
                      borderWidth: '1.5px',
                      borderColor: '#1E90FF',
                      backgroundColor: mode === 'dark' ? 'rgba(30,144,255,0.1)' : 'rgba(30,144,255,0.05)',
                    },
                  }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/signup"
                  variant="contained"
                  sx={{
                    fontWeight: 700,
                    fontSize: '15px',
                    borderRadius: '50px',
                    px: 3,
                    py: 0.7,
                    background: 'linear-gradient(135deg, #1E90FF 0%, #0055CC 100%)',
                    boxShadow: '0 2px 8px rgba(30,144,255,0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4DA8FF 0%, #1E90FF 100%)',
                      boxShadow: '0 4px 16px rgba(30,144,255,0.4)',
                    },
                  }}
                >
                  Sign Up
                </Button>
              </div>
            )}

            {TokenExist && (
              <Tooltip title="My Account" placement="bottom" arrow>
                <IconButton
                  onClick={() => navigate('/account')}
                  sx={{
                    ml: 1,
                    width: 42,
                    height: 42,
                    background: mode === 'dark'
                      ? 'linear-gradient(135deg, rgba(30,144,255,0.15) 0%, rgba(99,102,241,0.15) 100%)'
                      : 'linear-gradient(135deg, rgba(30,144,255,0.08) 0%, rgba(99,102,241,0.08) 100%)',
                    border: `1.5px solid ${mode === 'dark' ? 'rgba(30,144,255,0.25)' : 'rgba(30,144,255,0.2)'}`,
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      background: mode === 'dark'
                        ? 'linear-gradient(135deg, rgba(30,144,255,0.25) 0%, rgba(99,102,241,0.25) 100%)'
                        : 'linear-gradient(135deg, rgba(30,144,255,0.15) 0%, rgba(99,102,241,0.15) 100%)',
                      borderColor: '#1E90FF',
                      transform: 'scale(1.05)',
                      boxShadow: '0 3px 12px rgba(30,144,255,0.2)',
                    },
                  }}
                >
                  <AccountCircleRoundedIcon sx={{ fontSize: 26, color: mode === 'dark' ? '#90CAF9' : '#1E90FF' }} />
                </IconButton>
              </Tooltip>
            )}
          </div>
        </div >
        <div style={afterStyle}></div>
      </nav >



      {TokenExist && <Box
        sx={{
          fontFamily: "Quicksand",
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          padding: '8px 16px',
          overflowX: 'auto',
          backgroundColor: mode === 'dark' ? 'rgba(26,26,26,0.98)' : 'rgba(248,249,250,0.98)',
          backdropFilter: 'blur(10px)',
          color: mode === 'dark' ? '#fff' : '#000',
          zIndex: 1,
          gap: '6px',
          borderTop: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`,
          '&::-webkit-scrollbar': { height: '3px' },
          '&::-webkit-scrollbar-thumb': { background: 'rgba(128,128,128,0.2)', borderRadius: '2px' },
        }}
      >
        <div>
          <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            startIcon={<PublicRoundedIcon sx={{ fontSize: '20px !important' }} />}
            endIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: '18px !important', opacity: 0.7 }} />}
            sx={{
              fontWeight: 700,
              fontSize: '14px',
              fontFamily: "Quicksand",
              color: mode === 'dark' ? '#90CAF9' : '#1E90FF',
              backgroundColor: mode === 'dark' ? 'rgba(30,144,255,0.1)' : 'rgba(30,144,255,0.06)',
              border: `1.5px solid ${mode === 'dark' ? 'rgba(30,144,255,0.3)' : 'rgba(30,144,255,0.25)'}`,
              borderRadius: '50px',
              px: 2,
              py: 0.5,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              transition: 'all 0.25s ease',
              '&:hover': {
                backgroundColor: mode === 'dark' ? 'rgba(30,144,255,0.18)' : 'rgba(30,144,255,0.12)',
                borderColor: '#1E90FF',
                transform: 'translateY(-1px)',
                boxShadow: '0 3px 12px rgba(30,144,255,0.2)',
              },
            }}
          >
            Global
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            sx={{
              mt: 1.5,
              '& .MuiPaper-root': {
                borderRadius: '20px',
                bgcolor: mode === 'dark' ? '#1e1e1e' : '#fff',
                boxShadow: mode === 'dark'
                  ? '0 12px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)'
                  : '0 12px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)',
                p: 2.5,
                minWidth: 300,
              },
            }}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
              sx: { p: 0 },
            }}
          >
            <Typography sx={{
              fontFamily: "'Quicksand', sans-serif",
              fontWeight: 800,
              fontSize: '0.85rem',
              color: mode === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              mb: 2,
              px: 0.5,
            }}>
              Location Filter
            </Typography>
            <FormControl
              variant="outlined"
              fullWidth
              size="small"
              sx={{
                mb: 1.5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 500,
                  bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  '& fieldset': { borderColor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' },
                  '&:hover fieldset': { borderColor: '#1E90FF' },
                  '&.Mui-focused fieldset': { borderColor: '#1E90FF', borderWidth: '2px' },
                },
                '& .MuiInputLabel-root': { fontSize: '14px', fontWeight: 500 },
              }}
            >
              <InputLabel>Country</InputLabel>
              <Select
                label="Country"
                value={country}
                onChange={handleCountryChange}
              >
                {countryData && countryData.map((country, index) => (
                  <MenuItem key={index} value={country}>{country.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              variant="outlined"
              fullWidth
              size="small"
              sx={{
                mb: 1.5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 500,
                  bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  '& fieldset': { borderColor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' },
                  '&:hover fieldset': { borderColor: '#1E90FF' },
                  '&.Mui-focused fieldset': { borderColor: '#1E90FF', borderWidth: '2px' },
                },
                '& .MuiInputLabel-root': { fontSize: '14px', fontWeight: 500 },
              }}
            >
              <InputLabel>State</InputLabel>
              <Select
                label="State"
                value={state}
                onChange={(e) => { setState(e.target.value) }}
              >
                {stateData && stateData.map((state, index) => (
                  <MenuItem key={index} value={state}>{state.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              variant="outlined"
              fullWidth
              size="small"
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 500,
                  bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  '& fieldset': { borderColor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' },
                  '&:hover fieldset': { borderColor: '#1E90FF' },
                  '&.Mui-focused fieldset': { borderColor: '#1E90FF', borderWidth: '2px' },
                },
                '& .MuiInputLabel-root': { fontSize: '14px', fontWeight: 500 },
              }}
            >
              <InputLabel>City</InputLabel>
              <Select
                label="City"
                value={city}
                onChange={(e) => { setCity(e.target.value) }}
              >
                {cityData && cityData.map((city, index) => (
                  <MenuItem key={index} value={city}>{city.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                navigate(`/search?gl=${countryCode}&location=${city.name ? city.name : state.name ? state.name : ""}`);
                handleClose();
              }}
              sx={{
                fontWeight: 700,
                fontSize: '14px',
                borderRadius: '12px',
                py: 1.2,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #1E90FF 0%, #0055CC 100%)',
                boxShadow: '0 2px 8px rgba(30,144,255,0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4DA8FF 0%, #1E90FF 100%)',
                  boxShadow: '0 4px 16px rgba(30,144,255,0.4)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.25s ease',
              }}
              endIcon={<TravelExploreRoundedIcon />}
            >
              Find Localized News
            </Button>
          </Menu>
        </div>


        {quickSearchLoading ? (
          <>
            {[1, 2, 3, 4, 5].map((_, i) => (
              <Box
                key={i}
                sx={{
                  width: `${65 + i * 12}px`,
                  height: '32px',
                  borderRadius: '50px',
                  m: 0.3,
                  background: mode === 'dark'
                    ? 'linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 75%)'
                    : 'linear-gradient(90deg, rgba(0,0,0,0.06) 25%, rgba(0,0,0,0.10) 50%, rgba(0,0,0,0.06) 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite linear',
                  '@keyframes shimmer': {
                    '0%': { backgroundPosition: '200% 0' },
                    '100%': { backgroundPosition: '-200% 0' },
                  },
                }}
              />
            ))}
          </>
        ) : (
          quickSearchText?.map((text, index) => (
          <div key={index}>
            <Button
              onClick={() => navigate(`/search?q=${encodeURIComponent(text)}`)}
              onContextMenu={(e) => handleRightClick(e, text)}
              sx={{
                fontSize: '15px',
                fontFamily: "Quicksand",
                fontWeight: 600,
                color: mode === 'dark' ? '#e0e0e0' : '#333',
                boxShadow: 'none',
                borderRadius: '50px',
                zIndex: 2,
                backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                m: 0.3,
                px: 2,
                py: 0.5,
                textTransform: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: mode === 'dark' ? 'rgba(30,144,255,0.15)' : 'rgba(30,144,255,0.08)',
                  borderColor: 'rgb(30,144,255)',
                  color: 'rgb(30,144,255)',
                },
              }}
            >
              {text}
            </Button>
          </div>
        ))
        )}

        <div style={{ marginLeft: 'auto' }}>
          <Button
            id="add-box-button"
            aria-controls={showAddBox ? 'add-box-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={showAddBox ? 'true' : undefined}
            onClick={(e) => {
              setAnchorElAddBox(e.currentTarget);
              setShowAddBox(!showAddBox);
            }}
            startIcon={<AddRoundedIcon sx={{ fontSize: '18px !important' }} />}
            sx={{
              mr: 1,
              fontWeight: 700,
              fontSize: '14px',
              fontFamily: 'Quicksand',
              color: mode === 'dark' ? '#90CAF9' : '#1E90FF',
              backgroundColor: mode === 'dark' ? 'rgba(30,144,255,0.1)' : 'rgba(30,144,255,0.06)',
              border: `1.5px solid ${mode === 'dark' ? 'rgba(30,144,255,0.3)' : 'rgba(30,144,255,0.25)'}`,
              borderRadius: '50px',
              px: 2,
              py: 0.5,
              textTransform: 'none',
              letterSpacing: '0.3px',
              display: advancedSearchOpen ? 'none' : 'flex',
              transition: 'all 0.25s ease',
              '&:hover': {
                backgroundColor: mode === 'dark' ? 'rgba(30,144,255,0.18)' : 'rgba(30,144,255,0.12)',
                borderColor: '#1E90FF',
                transform: 'translateY(-1px)',
                boxShadow: '0 3px 12px rgba(30,144,255,0.2)',
              },
            }}
          >
            Add Topic
          </Button>

          <Menu
            id="add-box-menu"
            anchorEl={anchorElAddBox}
            open={showAddBox}
            onClose={() => setShowAddBox(false)}
            sx={{
              mt: 1,
              '& .MuiPaper-root': {
                bgcolor: mode === 'dark' ? '#2a2a2a' : '#fff',
                boxShadow: mode === 'dark' ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.12)',
                borderRadius: '16px',
                border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
              },
            }}
            MenuListProps={{
              'aria-labelledby': 'add-box-button',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                minWidth: '240px',
                p: 2,
              }}
            >
              <TextField
                value={newQuickSearch}
                onChange={(e) => setNewQuickSearch(e.target.value)}
                placeholder="e.g. Technology, Sports..."
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    color: mode === 'dark' ? '#fff' : '#000',
                    bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)',
                    '& fieldset': {
                      borderColor: mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#1E90FF',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1E90FF',
                      borderWidth: '2px',
                    },
                  },
                }}
              />
              <Button
                onClick={() => {
                  handleAddQuickSearch(newQuickSearch);
                  setNewQuickSearch('');
                  setShowAddBox(false);
                }}
                variant="contained"
                sx={{
                  fontFamily: 'Quicksand',
                  width: '100%',
                  borderRadius: '12px',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #1E90FF 0%, #0055CC 100%)',
                  boxShadow: '0 2px 8px rgba(30,144,255,0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4DA8FF 0%, #1E90FF 100%)',
                    boxShadow: '0 4px 16px rgba(30,144,255,0.4)',
                  },
                }}
              >
                Add Topic
              </Button>
            </Box>
          </Menu>
        </div>


      </Box >}

      {/* Custom Remove Topic Dialog */}
      <Dialog
        open={removeDialogOpen}
        onClose={() => setRemoveDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            bgcolor: mode === 'dark' ? '#1e1e2e' : '#fff',
            border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
            boxShadow: mode === 'dark'
              ? '0 16px 48px rgba(0,0,0,0.6)'
              : '0 16px 48px rgba(0,0,0,0.12)',
            minWidth: '340px',
            px: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: "'Quicksand', sans-serif",
            fontWeight: 700,
            fontSize: '20px',
            color: mode === 'dark' ? '#fff' : '#1a1a2e',
            pb: 0.5,
          }}
        >
          Remove Topic
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              fontFamily: "'Quicksand', sans-serif",
              fontWeight: 500,
              fontSize: '15px',
              color: mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
            }}
          >
            Are you sure you want to remove "<strong style={{ color: mode === 'dark' ? '#90CAF9' : '#1E90FF' }}>{topicToRemove}</strong>"?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => setRemoveDialogOpen(false)}
            sx={{
              fontFamily: "'Quicksand', sans-serif",
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: '10px',
              color: mode === 'dark' ? '#aaa' : '#666',
              px: 2.5,
              '&:hover': {
                backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmRemove}
            variant="contained"
            sx={{
              fontFamily: "'Quicksand', sans-serif",
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #e53935 0%, #c62828 100%)',
              boxShadow: '0 2px 8px rgba(229,57,53,0.3)',
              px: 2.5,
              '&:hover': {
                background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                boxShadow: '0 4px 16px rgba(229,57,53,0.4)',
              },
            }}
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
};

export default Navbar;