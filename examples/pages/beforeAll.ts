import { replace } from '../../src'
import { User as AnotherUser } from '../stores/anotherUser'
import { User } from '../stores/user'

replace(AnotherUser, User)
