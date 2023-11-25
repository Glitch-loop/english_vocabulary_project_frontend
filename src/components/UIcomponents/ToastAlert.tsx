import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { EAlert } from '../../Interfaces/enums';
import { IAlert } from '../../Interfaces/interfaces';
import { enqueueAlert, resetCurrentAlert } from '../../redux/slices/appSlice';
import { IoCloseCircleOutline, IoInformationCircleOutline, IoCheckmarkCircleOutline, IoWarningOutline } from 'react-icons/io5';

const ToastAlert = ({alertData}: {alertData: IAlert}) => {
  const dispatch = useDispatch();

  let dataContainer: {
    bgColor?: string;
    icon?: any;
    iconColor?: string;
    titleColor?: string;
    title?: string;
    messageColor?: string;
    message?: string;
  } = {
    bgColor: 'bg-white',
    icon: <IoCheckmarkCircleOutline />,
    iconColor: 'text-emerald-500',
    titleColor: 'text-emerald-600',
    title: 'Success',
    messageColor: 'text-emerald-600',
    message: alertData.message || 'The operation has completed'
  };

  switch (alertData.alertType) {
    case EAlert.error:
      dataContainer.bgColor = 'bg-white',
      // dataContainer.icon = 'fi-rr-cross-circle'
      dataContainer.icon = <IoCloseCircleOutline />
      dataContainer.iconColor = 'text-red-500',
      dataContainer.titleColor = 'text-red-600',
      dataContainer.title = 'Error',
      dataContainer.messageColor = 'text-red-600',
      dataContainer.message = alertData.message || 'An error has occurred'
      break;

    case EAlert.info:
      dataContainer.bgColor = 'bg-white',
      dataContainer.icon = <IoInformationCircleOutline />,
      dataContainer.iconColor = 'text-blue-500',
      dataContainer.titleColor = 'text-blue-600',
      dataContainer.title = 'Info',
      dataContainer.messageColor = 'text-blue-600',
      dataContainer.message = alertData.message || 'Info'
      break;

    case EAlert.warning:
      dataContainer.bgColor = 'bg-white',
      dataContainer.icon = <IoWarningOutline />,
      dataContainer.iconColor = 'text-orange-400',
      dataContainer.titleColor = 'text-orange-500',
      dataContainer.title = 'Warning',
      dataContainer.messageColor = 'text-orange-500',
      dataContainer.message = alertData.message || 'Warning'
      break;

    default:
      break;
  }

  const handleDismiss = () => {
    setTimeout(async() => {
      dispatch(resetCurrentAlert());
    }, 4000);
  }

  useEffect(() => {
    return () => {
      dispatch(enqueueAlert({type: 'reload'}))
    }
  }, []);
  

  return (
    <motion.div
      className='absolute flex -bottom-[70px] w-full md:w-auto md:right-10 z-30'
      initial={{y: 0}}
      animate={{y: -100}}
      exit={{y: 0}}
      transition={{ ease: 'easeInOut'}}
      onAnimationComplete={handleDismiss}
    >
      <div className={`flex gap-x-3 mx-auto ${dataContainer.bgColor} pt-3 pb-2 px-3 rounded-lg shadow-container`}>
        <i className={`text-[20px] mt-1 ${dataContainer.iconColor}`}>
          {dataContainer.icon}
        </i>
        {/* <i className={`fi ${dataContainer.icon} mt-1 ${dataContainer.iconColor}`}/> */}
        <div className='flex flex-col'>
          <p className={`font-semibold text-[17px] ${dataContainer.titleColor}`}>{dataContainer.title}</p>
          <p className={dataContainer.messageColor}>{dataContainer.message}</p>
        </div>
      </div>
    </motion.div>
  )
}

// const IconDeterminer = (obj) => {
//   const { text: color, type } = obj;

//   switch (type) {
//     case 'success':
//       return <SimpleLineIcons name="check" size={20} color={color}/>  
//     default:
//       return null;
//   }
// }

export default ToastAlert