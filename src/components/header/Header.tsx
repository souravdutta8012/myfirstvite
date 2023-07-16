import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { AppBar, Avatar, Box, Divider, IconButton, Popover, Toolbar, Tooltip } from "@mui/material";
import { BubbleChartRounded, MoreVertRounded } from '@mui/icons-material';
import { useUserState } from "../../util/User";
import { getPicture } from "../../util/Api";

export default function Header() {
    const { auth } = useUserState();

    const [pictureData, setPictureData] = useState<any>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);

    useEffect(() => {
        getPictureData();
        // eslint-disable-next-line
    }, []);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const stringAvatar = (name: string) => {
        return {
            sx: {
                bgcolor: "#00354D",
                width: 45,
                height: 45,
            },
            children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        };
    };

    const getPictureData = async () => {
        let payload = {
            email: auth.email
        }
        const response: any = await getPicture(payload);
        if (response) {
            setPictureData(response?.result);
        }
    };

    return (
        <>
            <AppBar position="sticky">
                <Toolbar variant="dense" className="bg-primary p-0">
                    <Link to="/">
                        <img className="h-12" src="/woodside.svg" alt="Logo" />
                    </Link>
                    <Box className="flex justify-between items-center w-full">
                        <Box className="font-semibold ml-5">
                            Woodside Interface Management System
                        </Box>
                        <Box className="mr-2">
                            <Box className="flex gap-4">
                                <Tooltip title="More">
                                    <IconButton className="text-white" onClick={handleClick}>
                                        <MoreVertRounded />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Popover
                                open={open}
                                anchorEl={anchorEl}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                            >
                                <Box className="flex flex-col gap-4">
                                    <Box className="flex justify-center items-center pt-4 px-8">
                                        {pictureData ? (
                                            <Avatar src={`data:image/jpeg;base64,${pictureData}`} className="w-12 h-12" />
                                        ) : (
                                            <Avatar {...stringAvatar(`${auth?.firstname} ${auth?.lastname}`)} className="w-12 h-12" />
                                        )}
                                        <Box className="ml-5">
                                            <Box className="font-semibold text-gray-600">
                                                Hey, {auth?.firstname} {auth?.lastname}
                                            </Box>
                                            <Box className="text-sm text-gray-600">
                                                {auth?.email}
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Divider />
                                    <Box className="text-sm text-blue-500 pb-4 px-8">
                                        <BubbleChartRounded /> Having issues? Please contact <a className="underline font-medium" href="mailto:wimsadmin@woodside.com.au">WIMS Admin</a>
                                    </Box>
                                </Box>
                            </Popover>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar >
        </>
    )
}