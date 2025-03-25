// import React, { useEffect, useState, useMemo } from 'react';
// import {
//   Table, TableBody, TableCell, TableContainer,
//   TableHead, TableRow, Paper, IconButton, Typography,
//   Button, Box, SelectChangeEvent,
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import PauseIcon from '@mui/icons-material/Pause';
// import ContentCopyIcon from '@mui/icons-material/ContentCopy';
// import FilterBar from './CampaignListingFilter';

// interface Campaign {
//   id: string;
//   name: string;
//   status: string;
//   type: string;
//   openRate: string;
//   ctr: string;
//   delivered: string;
//   publishedOn: string;
// }

// interface FilterProps {
//   onSearch: (searchTerm: string) => void;
//   onStatusChange: (status: string) => void;
//   onTypeChange: (type: string) => void;
//   onDateRangeChange: (range: string) => void;
//   onSortChange: (sortBy: string) => void;
// }

// const fetchCampaigns = async (): Promise<Campaign[]> => {
//   return Promise.resolve([
//     {
//       id: '#ID-4355',
//       name: 'Sample Campaign 1',
//       status: 'On Going',
//       type: 'Real time',
//       openRate: '51k',
//       ctr: '48k',
//       delivered: '0.51k',
//       publishedOn: '05 Mar 2020'
//     },
//     {
//       id: '#ID-4335',
//       name: 'Promo Powerhouse',
//       status: 'Expired',
//       type: 'Scheduled',
//       openRate: '25k',
//       ctr: '14k',
//       delivered: '0.28k',
//       publishedOn: '25 Jan 2021'
//     },
//     {
//       id: '#ID-4353',
//       name: 'Brand Boosters',
//       status: 'Completed',
//       type: 'Criteria Based',
//       openRate: '75k',
//       ctr: '49k',
//       delivered: '0.68k',
//       publishedOn: '22 Apr 2022'
//     }
//   ]);
// };

// const CampaignsTable: React.FC = () => {
//   const [query, setQuery] = useState<string>("");
//   const [statusFilter, setStatusFilter] = useState<string>("All");

//   const [campaigns, setCampaigns] = useState<Campaign[]>([]);

//   useEffect(() => {
//     (async () => {
//       try {
//         const data = await fetchCampaigns();
//         setCampaigns(data);
//       } catch (error) {
//         console.error('Error fetching campaigns:', error);
//       }
//     })();
//   }, []);


//   //FilterBar FUnctions
//   // const handleSearch = (searchTerm: string) => {
//   //   console.log('Search term:', searchTerm);
//   //   // Perform API call or filtering logic
//   // };

//   // const handleStatusChange = (event: SelectChangeEvent) => {
//   //   setStatusFilter(event.target.value as string);
//   //   // console.log('Status changed:', status);
//   //   // Perform API call or filtering logic
//   // };

//   // const handleTypeChange = (type: string) => {
//   //   console.log('Type changed:', type);
//   //   // Perform API call or filtering logic
//   // };

//   // const handleDateRangeChange = (range: string) => {
//   //   console.log('Date Range changed:', range);
//   //   // Perform API call or filtering logic
//   // };

//   // const handleSortChange = (sortBy: string) => {
//   //   console.log('Sort by:', sortBy);
//   //   // Perform API call or filtering logic
//   // };



//   return (
      
//       <TableContainer component={Paper} sx={{ margin: '20px auto', maxWidth: '80vw', pl:2, pr:2,borderRadius: '10px', overflow: 'x'  }}>
//         <Typography variant="h6" align="center" sx={{ margin: '20px 0', }}>
//           Campaigns Overview
//         </Typography>
//         <FilterBar
        
//       />
//         <Table>
//           <TableHead >
//             <TableRow sx={{bgcolor: '#F3F3F3', borderRadius:'10px',}}>
//               <TableCell sx={{color: '#495057', textAlign:"center" }}>NAME</TableCell>
//               <TableCell sx={{color: '#495057', textAlign:"center" }}>STATUS</TableCell>
//               <TableCell sx={{color: '#495057', textAlign:"center" }}>TYPE</TableCell>
//               <TableCell sx={{color: '#495057', textAlign:"center" }}>OPEN RATE</TableCell>
//               <TableCell sx={{color: '#495057', textAlign:"center" }}>CTR</TableCell>
//               <TableCell sx={{color: '#495057', textAlign:"center" }}>DELIVERED</TableCell>
//               <TableCell sx={{color: '#495057', textAlign:"center" }}>ACTIONS</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//   {/* Optional top spacer row */}
//   <TableRow key="top-spacer">&nbsp;
//     {/* <TableCell colSpan={7}></TableCell> */}
//   </TableRow>
//   {filteredCampaign.map((campaign) => (
//     <React.Fragment key={campaign.id}>
//       <TableRow sx={{ borderRadius: '10px', border: '2px solid #ECEEF6', '& td, & th': { padding: '3px 5px' } }}>
//         <TableCell>
//           <Button sx={{ color: "#0057D9", bgcolor: "#F2F7FF", fontSize: "12px" }}>
//             {campaign.id}
//           </Button>
//           <Typography sx={{ fontWeight: "bold", fontSize: "12px", pt: 0.25, pb: 0.25 }}>
//             {campaign.name}
//           </Typography>
//           <Typography sx={{ color: "#626262", fontSize: "12px" }}>
//             Published on {campaign.publishedOn}
//           </Typography>
//         </TableCell>
//         <TableCell>
//           <Button sx={{
//             color: campaign.status === 'Expired' ? '#F83738' : campaign.status === 'Completed' ? '#0057D9':'#52B141',
//             bgcolor: campaign.status === 'Expired' ? '#F8DDDD' : campaign.status === 'Completed' ? '#E2ECFC':'#E6F5E3',
//             fontSize: '12px',
//             fontWeight: 'semi-bold'
//           }}>
//             {campaign.status}
//           </Button>
//         </TableCell>
//         <TableCell sx={{ textAlign: "center" }}>{campaign.type}</TableCell>
//         <TableCell sx={{ textAlign: "center" }}>{campaign.openRate}</TableCell>
//         <TableCell sx={{ textAlign: "center" }}>
//           <Typography sx={{ color: '#6D6976' }}>
//             {campaign.ctr}
//           </Typography>
//         </TableCell>
//         <TableCell>
//           <Typography sx={{ color: '#6D6976', textAlign: "center" }}>
//             {campaign.delivered}
//           </Typography>
//         </TableCell>
//         <TableCell sx={{ textAlign: "center" }}>
//           <IconButton onClick={() => console.log('Edit clicked', campaign.id)}>
//             <EditIcon sx={{ fontSize: '25px', color: '#6A7075', bgcolor: '#EFEFEF', p: 0.7, borderRadius: '4.5px' }} />
//           </IconButton>
//           <IconButton onClick={() => console.log('Pause clicked', campaign.id)}>
//             <PauseIcon sx={{ fontSize: '25px', color: '#6A7075', bgcolor: '#EFEFEF', p: 0.7, borderRadius: '4.5px' }} />
//           </IconButton>
//           <IconButton onClick={() => console.log('Copy clicked', campaign.id)}>
//             <ContentCopyIcon sx={{ fontSize: '25px', color: '#6A7075', bgcolor: '#EFEFEF', p: 0.7, borderRadius: '4.5px' }} />
//           </IconButton>
//           <IconButton sx={{ m: '0px' }} onClick={() => console.log('Delete clicked', campaign.id)}>
//             <DeleteIcon sx={{ fontSize: '25px', color: 'white', bgcolor: '#F83738', p: 0.5, borderRadius: '4.5px' }} />
//           </IconButton>
//         </TableCell>
//       </TableRow>
//       {/* Spacer row with its own key */}
//       <TableRow key={`${campaign.id}-spacer`}>&nbsp;
//         {/* <TableCell colSpan={7}>&nbsp;</TableCell> */}
//       </TableRow>
//     </React.Fragment>
//   ))}
//   {/* Optional bottom spacer row */}
//   <TableRow key="bottom-spacer" sx={{ display: 'none' }}>
  
// </TableRow>
// </TableBody>

//         </Table>
//       </TableContainer>
   
//   );
// };

// export default CampaignsTable;
import React from 'react'

const CampaignListing = () => {
  return (
    <div>CampaignListing</div>
  )
}

export default CampaignListing