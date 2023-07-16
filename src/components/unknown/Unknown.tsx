import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { HomeRounded } from '@mui/icons-material';

export default function Unknown() {
    let navigate = useNavigate();

    return (
        <>
            <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Box className="flex flex-col justify-center items-center">
                    <Box className="mb-14">
                        <img className="h-60 w-full" src="/page-not-found.svg" alt="not found" />
                    </Box>
                    <Box className="font-semibold text-2xl mb-8">
                        Page Not Found !
                    </Box>
                    <Box>
                        <Button
                            className="bg-primary font-semibold capitalize"
                            variant="contained"
                            size="large"
                            startIcon={<HomeRounded />}
                            onClick={() => navigate("/")}
                        >
                            go to home
                        </Button>
                    </Box>
                </Box>
            </Box>
        </>
    )
}