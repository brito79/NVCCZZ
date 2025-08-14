'use client'

import { useRouter } from "next/navigation";


const ERPHome = () => {
  const router = useRouter()
  router.push('/ERP/Dashboard')
  return ( <>
  
  </> );
}
 
export default ERPHome;