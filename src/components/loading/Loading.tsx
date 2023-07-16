import { Box, CircularProgress, LinearProgress } from "@mui/material";

export default function Loading() {
    return (
        <>
            <Box>
                <Box>
                    <LinearProgress classes={{ colorPrimary: 'bg-white', barColorPrimary: 'bg-primary', bar: 'rounded-full' }} />
                </Box>
                <Box className="flex justify-center items-center pt-52">
                    <Box className="flex justify-center items-center mr-4">
                        <CircularProgress size="35px" className="text-primary" />
                    </Box>
                    <Box className="text-3xl text-primary">
                        Please wait while we are getting things ready ...
                    </Box>
                </Box>
            </Box>
        </>
    )
}